export const maxDuration = 30

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const { message, userId } = await request.json()

  if (userId) {
    await supabase.from('ideas').insert({
      content: message,
      tag: 'General',
      user_id: userId,
    })
  }

  const isSpreadsheetRequest = message.toLowerCase().includes('spreadsheet') || 
    message.toLowerCase().includes('excel') || 
    message.toLowerCase().includes('content calendar') ||
    message.toLowerCase().includes('schedule')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: isSpreadsheetRequest ? 
    `You are Clarity's AI assistant. The user wants a spreadsheet. 
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
    :
    `You are Clarity's AI assistant. Your job is to help users organize their thoughts, ideas, tasks and goals.

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
    if (isSpreadsheetRequest) {
      try {
        const clean = content.text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        return NextResponse.json({ reply: parsed.message, spreadsheet: parsed })
      } catch {
        return NextResponse.json({ reply: content.text })
      }
    }
    return NextResponse.json({ reply: content.text })
  }

  return NextResponse.json({ reply: 'Something went wrong' })
}