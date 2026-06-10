export const maxDuration = 30

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { checkRateLimit } from '../../../lib/rateLimit'
import { logAiCall } from '../../../lib/auditLog'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-6'

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

async function fetchOEmbed(videoUrl: string) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`)
    if (!res.ok) return null
    return await res.json() as { title?: string; author_name?: string }
  } catch { return null }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'auth_error', message: 'You must be logged in.' }, { status: 401 })

  const rateCheck = checkRateLimit(`video:${user.id}`, 10)
  if (!rateCheck.allowed) return NextResponse.json({ error: 'rate_limited', message: `Please wait ${rateCheck.retryAfterSeconds}s.` }, { status: 429 })

  let videoUrl: string
  try {
    const body = await request.json()
    videoUrl = String(body.url ?? '').trim()
    if (!videoUrl) return NextResponse.json({ error: 'bad_request', message: 'URL is required.' }, { status: 400 })
  } catch { return NextResponse.json({ error: 'bad_request', message: 'Invalid request.' }, { status: 400 }) }

  const videoId = extractVideoId(videoUrl)
  if (!videoId) return NextResponse.json({ error: 'bad_request', message: 'Could not find a valid YouTube video ID in that URL.' }, { status: 400 })

  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`
  const oEmbed = await fetchOEmbed(canonicalUrl)

  if (!oEmbed?.title) return NextResponse.json({ error: 'fetch_failed', message: 'Could not fetch video data. The video may be private or unavailable.' }, { status: 422 })

  const prompt = `You are a world-class content strategist specializing in YouTube.

Real video data:
Title: ${oEmbed.title}
Channel: ${oEmbed.author_name || 'unknown'}
URL: ${canonicalUrl}

Return ONLY a raw JSON object, no markdown, no backticks:
{"title":"${oEmbed.title}","score":<0-100>,"hooks":["5 specific hooks for this exact video topic"],"contentIdeas":["6 related content ideas specific to this topic"],"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"],"strategy":"2-3 sentences of specific advice for this video","postingTips":["3 specific tips for this content"],"niche":"specific niche","format":"Short form/Long form/Tutorial/etc"}`

  try {
    const response = await client.messages.create({ model: MODEL, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
    const content = response.content[0]
    if (content.type !== 'text') return NextResponse.json({ error: 'ai_error', message: 'Unexpected AI response.' }, { status: 500 })

    logAiCall(supabase, { userId: user.id, route: '/api/video', model: MODEL, inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens, success: true, durationMs: Date.now() - startedAt })

    const clean = content.text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json({ ...parsed, videoId })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    logAiCall(supabase, { userId: user.id, route: '/api/video', model: MODEL, inputTokens: 0, outputTokens: 0, success: false, errorCode: 'ai_error', errorMessage: msg, durationMs: Date.now() - startedAt })
    return NextResponse.json({ error: 'ai_error', message: 'Analysis failed. Please try again.' }, { status: 502 })
  }
}
