export const maxDuration = 60  // streaming needs more time than a regular response

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { buildUsageStats, dailyLimitMessage } from '../../../lib/aiLimits'
import { canUseAi, getUserPlan, incrementAiUsage } from '../../../lib/aiUsageServer'
import { checkRateLimit } from '../../../lib/rateLimit'
import { logAiCall, getDailyTokens, DAILY_TOKEN_CAPS } from '../../../lib/auditLog'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODEL = 'claude-sonnet-4-6'

async function saveChatOutput(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  message: string,
  replyText: string
) {
  const { error } = await supabase.from('outputs').insert({
    user_id: userId,
    type: 'chat',
    title: message.length > 80 ? message.slice(0, 80) + '…' : message,
    payload: { message, reply: replyText },
  })
  if (error) console.error('Failed to save chat output:', error)
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

  // ── 1. Auth ──────────────────────────────────────────────
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'auth_error', message: 'You need to be logged in to use the AI. Please refresh and try again.' },
      { status: 401 }
    )
  }

  // ── 2. Rate limiting (20 requests/minute per user) ────────
  const rateCheck = checkRateLimit(user.id)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: 'rate_limited',
        message: `You're sending messages too fast. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
      }
    )
  }

  // ── 3. Parse and validate request body ───────────────────
  let message: string
  try {
    const body = await request.json()
    message = String(body.message ?? '').trim()
    if (!message) {
      return NextResponse.json(
        { error: 'bad_request', message: 'Message cannot be empty.' },
        { status: 400 }
      )
    }
    if (message.length > 10_000) {
      return NextResponse.json(
        { error: 'bad_request', message: 'Message is too long. Please keep it under 10,000 characters.' },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'bad_request', message: 'Invalid request format. Please try again.' },
      { status: 400 }
    )
  }

  // ── 4. Daily message limit check ──────────────────────────
  const plan = await getUserPlan(supabase, user.id)
  const { allowed, stats } = await canUseAi(supabase, user.id)

  if (!allowed) {
    return NextResponse.json(
      { error: 'daily_limit', reply: dailyLimitMessage(), usage: stats },
      { status: 429 }
    )
  }

  // ── 5. Daily token cap (prevents single user draining $$$) ─
  const tokenCap = DAILY_TOKEN_CAPS[plan]
  if (tokenCap !== null && tokenCap !== undefined) {
    const tokensUsedToday = await getDailyTokens(supabase, user.id)
    if (tokensUsedToday >= tokenCap) {
      return NextResponse.json(
        {
          error: 'token_limit',
          message: `You've used your daily token allowance (${tokenCap.toLocaleString()} tokens). This resets at midnight UTC. Upgrade for a higher limit.`,
        },
        { status: 429 }
      )
    }
  }

  // ── 6. Determine request type ─────────────────────────────
  const lc = message.toLowerCase()
  const isSpreadsheetRequest =
    lc.includes('spreadsheet') ||
    lc.includes('excel') ||
    lc.includes('content calendar') ||
    lc.includes('schedule')

  const priorityNote =
    plan === 'premium'
      ? '\n• This user is on Premium — be especially thorough.'
      : ''

  const systemPrompt = isSpreadsheetRequest
    ? `You are Clarity's AI assistant. The user wants a spreadsheet.${priorityNote}
Respond with a JSON object in this exact format and nothing else:
{
  "type": "spreadsheet",
  "title": "Spreadsheet title here",
  "headers": ["Column 1", "Column 2", "Column 3"],
  "rows": [
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
  ],
  "message": "Here's your spreadsheet! Click the button below to download it."
}
Make it detailed and useful with at least 10 rows of real data.`
    : `You are Clarity's AI assistant. Your job is to help users organize their thoughts, ideas, tasks and goals.${priorityNote}

When a user sends you a message:
• Act immediately — if they ask for a plan, make the plan right away
• Format everything with bullet points and clear sections
• Keep it clean and scannable
• After delivering the output, ask ONE simple question like "Want me to adjust anything?"
• Never ask multiple questions before doing the task`

  // ── 7a. Spreadsheet: non-streaming JSON response ──────────
  if (isSpreadsheetRequest) {
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: `<user_input>\n${message}\n</user_input>` }],
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        return NextResponse.json(
          { error: 'ai_error', message: 'The AI returned an unexpected response. Please try again.' },
          { status: 500 }
        )
      }

      const totalTokens = response.usage.input_tokens + response.usage.output_tokens

      await supabase.from('ideas').insert({ content: message, tag: 'Spreadsheet', user_id: user.id })
      const usedAfter = await incrementAiUsage(supabase, user.id)
      const usage = buildUsageStats(plan, usedAfter)

      logAiCall(supabase, {
        userId: user.id, route: '/api/chat', model: MODEL,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        success: true, durationMs: Date.now() - startedAt,
      })

      try {
        const clean = content.text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        const { error: outputError } = await supabase.from('outputs').insert({
          user_id: user.id,
          type: 'spreadsheet',
          title: parsed.title,
          payload: { headers: parsed.headers, rows: parsed.rows },
        })
        if (outputError) console.error('Failed to save spreadsheet output:', outputError)
        return NextResponse.json({ reply: parsed.message, spreadsheet: parsed, usage, tokens: totalTokens })
      } catch {
        await saveChatOutput(supabase, user.id, message, content.text)
        return NextResponse.json({ reply: content.text, usage, tokens: totalTokens })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      logAiCall(supabase, {
        userId: user.id, route: '/api/chat', model: MODEL,
        inputTokens: 0, outputTokens: 0, success: false,
        errorCode: 'ai_error', errorMessage: msg,
        durationMs: Date.now() - startedAt,
      })
      return NextResponse.json(
        { error: 'ai_error', message: 'The AI failed to generate your spreadsheet. Please try again in a moment.' },
        { status: 502 }
      )
    }
  }

  // ── 7b. Regular chat: streaming SSE response ──────────────
  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      const send = (obj: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      }

      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: 'user', content: `<user_input>\n${message}\n</user_input>` }],
        })

        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            send({ type: 'delta', text: chunk.delta.text })
          }
        }

        const final = await stream.finalMessage()
        const totalTokens = final.usage.input_tokens + final.usage.output_tokens
        const replyText = final.content
          .filter((block): block is Extract<typeof block, { type: 'text' }> => block.type === 'text')
          .map(block => block.text)
          .join('')

        await supabase.from('ideas').insert({ content: message, tag: 'General', user_id: user.id })
        await saveChatOutput(supabase, user.id, message, replyText)
        const usedAfter = await incrementAiUsage(supabase, user.id)
        const usage = buildUsageStats(plan, usedAfter)

        logAiCall(supabase, {
          userId: user.id, route: '/api/chat', model: MODEL,
          inputTokens: final.usage.input_tokens,
          outputTokens: final.usage.output_tokens,
          success: true, durationMs: Date.now() - startedAt,
        })

        send({ type: 'done', usage, tokens: totalTokens })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        logAiCall(supabase, {
          userId: user.id, route: '/api/chat', model: MODEL,
          inputTokens: 0, outputTokens: 0, success: false,
          errorCode: 'ai_stream_error', errorMessage: msg,
          durationMs: Date.now() - startedAt,
        })
        send({
          type: 'error',
          message: 'The AI connection was interrupted. Your message was not counted — please try again.',
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
