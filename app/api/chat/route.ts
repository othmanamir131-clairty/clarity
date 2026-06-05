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
    • Ask smart follow up questions to understand what they need
    • Once you have enough info, offer to create a spreadsheet, action plan, or content calendar
    • Always format responses with bullet points using • 
    • Keep responses short and scannable — never write long paragraphs
    • Always end with a question or a clear next step`,
    messages: [{ role: 'user', content: message }],
  })

  const content = response.content[0]
  if (content.type === 'text') {
    return NextResponse.json({ reply: content.text })
  }

  return NextResponse.json({ reply: 'Something went wrong' })
}