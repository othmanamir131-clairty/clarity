export const maxDuration = 30

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { checkRateLimit } from '../../../lib/rateLimit'
import { logAiCall } from '../../../lib/auditLog'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODEL = 'claude-sonnet-4-6'

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

  // ── 1. Auth ───────────────────────────────────────────────
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'auth_error', message: 'You need to be logged in to generate a report.' },
      { status: 401 }
    )
  }

  // ── 2. Rate limit (reports are expensive — cap at 5/min) ──
  const rateCheck = checkRateLimit(`report:${user.id}`, 5)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: 'rate_limited',
        message: `Report generation is rate-limited. Please wait ${rateCheck.retryAfterSeconds} seconds.`,
      },
      { status: 429 }
    )
  }

  // ── 3. Parse request ──────────────────────────────────────
  let ideas: { content: string }[]
  try {
    const body = await request.json()
    ideas = Array.isArray(body.ideas) ? body.ideas : []
  } catch {
    return NextResponse.json(
      { error: 'bad_request', message: 'Invalid request format.' },
      { status: 400 }
    )
  }

  if (ideas.length === 0) {
    return NextResponse.json({
      score: 0,
      report: 'No ideas yet! Start dumping your thoughts into Clarity to get your first score.',
    })
  }

  // ── 4. Generate report ────────────────────────────────────
  const ideasText = ideas
    .slice(0, 100) // cap at 100 ideas to control token usage
    .map(idea => `- ${idea.content}`)
    .join('\n')

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: `You are Clarity's personal AI coach. You analyze a user's saved ideas and generate a weekly Clarity Score and report.

The Clarity Score (0-100) is based on:
- How many ideas they have (more = better, max 30 points)
- How diverse their ideas are (different topics = better, max 20 points)
- How actionable their ideas seem (specific = better, max 30 points)
- Overall momentum (max 20 points)

Respond in this exact JSON format with no other text:
{
  "score": 75,
  "report": "Your report here with bullet points using • and line breaks"
}

The report should:
• Be personal and encouraging
• Call out their top 2-3 themes
• Give 1 specific action they should take this week
• Be under 150 words
• Use • for bullet points`,
      messages: [
        {
          role: 'user',
          content: `Generate my Clarity Score and weekly report based on the ideas below.\n\n<user_ideas>\n${ideasText}\n</user_ideas>`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'ai_error', message: 'The AI returned an unexpected response. Please try again.' },
        { status: 500 }
      )
    }

    logAiCall(supabase, {
      userId: user.id, route: '/api/report', model: MODEL,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      success: true, durationMs: Date.now() - startedAt,
    })

    let parsed: { score: number; report: string }
    try {
      const clean = content.text.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      parsed = { score: 50, report: content.text }
    }

    const { error: saveError } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          clarity_score: parsed.score,
          clarity_report: parsed.report,
          clarity_score_updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
    if (saveError) console.error('Failed to save clarity score:', saveError)

    return NextResponse.json(parsed)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    logAiCall(supabase, {
      userId: user.id, route: '/api/report', model: MODEL,
      inputTokens: 0, outputTokens: 0, success: false,
      errorCode: 'ai_error', errorMessage: msg,
      durationMs: Date.now() - startedAt,
    })
    return NextResponse.json(
      {
        error: 'ai_error',
        message: 'Failed to generate your Clarity Score. This is usually temporary — please try again in a few seconds.',
      },
      { status: 502 }
    )
  }
}
