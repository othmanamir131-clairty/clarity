export const maxDuration = 30

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const { message } = await request.json()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are Clarity's AI assistant. Your job is to help users organize their thoughts, ideas, tasks and goals.

    When a user sends you a message:
    • Act immediately — if they ask for a plan, make the plan right away
    • If they ask for a content calendar, create it immediately
    • If they ask for a spreadsheet layout, create it immediately
    • Format everything with bullet points and clear sections
    • Keep it clean and scannable
    • After delivering the output, ask ONE simple question like "Want me to adjust anything?"
    • Never ask multiple questions before doing the task
    • Just do it first, then offer to refine`,
    messages: [{ role: 'user', content: message }],
  })

  const content = response.content[0]
  if (content.type === 'text') {
    return NextResponse.json({ reply: content.text })
  }

  return NextResponse.json({ reply: 'Something went wrong' })
}