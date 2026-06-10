export const maxDuration = 30

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { checkRateLimit } from '../../../lib/rateLimit'
import { logAiCall } from '../../../lib/auditLog'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-6'

// ── Helpers ───────────────────────────────────────────────────

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

interface OEmbedData {
  title?: string
  author_name?: string
  thumbnail_url?: string
}

async function fetchOEmbed(videoUrl: string): Promise<OEmbedData | null> {
  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`
    const res = await fetch(endpoint, { headers: { 'User-Agent': 'ClarityApp/1.0' } })
    if (!res.ok) return null
    return await res.json() as OEmbedData
  } catch {
    return null
  }
}

interface YouTubeApiData {
  title: string
  description: string
  tags: string[]
  viewCount: string
  likeCount: string
  duration: string
  channelTitle: string
  publishedAt: string
  categoryId: string
}

async function fetchYouTubeApi(videoId: string): Promise<YouTubeApiData | null> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return null
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json() as {
      items?: Array<{
        snippet?: { title?: string; description?: string; tags?: string[]; channelTitle?: string; publishedAt?: string; categoryId?: string }
        statistics?: { viewCount?: string; likeCount?: string }
        contentDetails?: { duration?: string }
      }>
    }
    const item = data.items?.[0]
    if (!item) return null
    return {
      title: item.snippet?.title || '',
      description: (item.snippet?.description || '').slice(0, 1000),
      tags: item.snippet?.tags?.slice(0, 20) || [],
      viewCount: item.statistics?.viewCount || '0',
      likeCount: item.statistics?.likeCount || '0',
      duration: item.contentDetails?.duration || '',
      channelTitle: item.snippet?.channelTitle || '',
      publishedAt: item.snippet?.publishedAt || '',
      categoryId: item.snippet?.categoryId || '',
    }
  } catch {
    return null
  }
}

// ── Route ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

  // Auth
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'auth_error', message: 'You must be logged in.' }, { status: 401 })
  }

  // Rate limit: 10/min for video analysis
  const rateCheck = checkRateLimit(`video:${user.id}`, 10)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', message: `Too many requests. Please wait ${rateCheck.retryAfterSeconds}s.` },
      { status: 429 }
    )
  }

  // Parse body
  let videoUrl: string
  try {
    const body = await request.json()
    videoUrl = String(body.url ?? '').trim()
    if (!videoUrl) return NextResponse.json({ error: 'bad_request', message: 'URL is required.' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Invalid request.' }, { status: 400 })
  }

  // Extract video ID
  const videoId = extractVideoId(videoUrl)
  if (!videoId) {
    return NextResponse.json({ error: 'bad_request', message: 'Could not find a valid YouTube video ID in that URL.' }, { status: 400 })
  }

  // Fetch real video data — oEmbed first, YouTube API if available
  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`
  const [oEmbed, ytData] = await Promise.all([
    fetchOEmbed(canonicalUrl),
    fetchYouTubeApi(videoId),
  ])

  // Build context block for the AI
  let videoContext: string
  if (ytData) {
    // Full data from YouTube API
    const views = parseInt(ytData.viewCount).toLocaleString()
    const likes = parseInt(ytData.likeCount).toLocaleString()
    videoContext = `
Video title: ${ytData.title}
Channel: ${ytData.channelTitle}
Published: ${ytData.publishedAt ? new Date(ytData.publishedAt).toDateString() : 'unknown'}
Views: ${views}
Likes: ${likes}
Duration: ${ytData.duration}
Tags: ${ytData.tags.join(', ') || 'none listed'}
Description: ${ytData.description || 'no description'}
`.trim()
  } else if (oEmbed?.title) {
    // Partial data from oEmbed
    videoContext = `
Video title: ${oEmbed.title}
Channel: ${oEmbed.author_name || 'unknown'}
URL: ${canonicalUrl}
Note: Only title and channel name are available. Base your analysis primarily on the title and what it signals about the content.
`.trim()
  } else {
    // URL only — video may be private or unavailable
    return NextResponse.json({
      error: 'fetch_failed',
      message: 'Could not fetch video data. The video may be private, age-restricted, or unavailable.',
    }, { status: 422 })
  }

  // Build prompt
  const prompt = `You are a world-class content strategist specializing in YouTube and short-form video.

Here is the real data for the video the user wants to analyze:

<video_data>
${videoContext}
</video_data>

Based on this real video data, produce a comprehensive content strategy analysis.

Return ONLY a raw JSON object — no markdown, no backticks, no explanation. Exact structure:
{
  "title": "The real video title (copy it exactly)",
  "score": <number 0-100 based on the title/content strength, views if available, engagement>,
  "hooks": ["5 scroll-stopping hook rewrites or alternate angles for this specific topic"],
  "contentIdeas": ["6 related content ideas the creator should make next, specific to this video's topic"],
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"],
  "strategy": "2-3 sentences of specific strategic advice for this video and creator",
  "postingTips": ["3 specific tips based on this video's content and format"],
  "niche": "The specific niche this video belongs to",
  "format": "Short form / Long form / Tutorial / Vlog / Review / etc"
}`

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'ai_error', message: 'Unexpected AI response.' }, { status: 500 })
    }

    logAiCall(supabase, {
      userId: user.id, route: '/api/video', model: MODEL,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      success: true, durationMs: Date.now() - startedAt,
    })

    try {
      const clean = content.text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      return NextResponse.json({ ...parsed, videoId, hasRealData: true })
    } catch {
      return NextResponse.json({ error: 'parse_error', message: 'Could not parse AI response.' }, { status: 500 })
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    logAiCall(supabase, {
      userId: user.id, route: '/api/video', model: MODEL,
      inputTokens: 0, outputTokens: 0, success: false,
      errorCode: 'ai_error', errorMessage: msg,
      durationMs: Date.now() - startedAt,
    })
    return NextResponse.json({ error: 'ai_error', message: 'AI analysis failed. Please try again.' }, { status: 502 })
  }
}
