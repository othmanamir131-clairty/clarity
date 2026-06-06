import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const { ideas } = await request.json()

  if (!ideas || ideas.length === 0) {
    return NextResponse.json({ score: 0, report: 'No ideas yet! Start dumping your thoughts into Clarity to get your first score.' })
  }

  const ideasText = ideas.map((idea: any) => `- ${idea.content}`).join('\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
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
    messages: [{ role: 'user', content: `Here are my saved ideas:\n${ideasText}\n\nGenerate my Clarity Score and weekly report.` }],
  })

  const content = response.content[0]
  if (content.type === 'text') {
    try {
      const clean = content.text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ score: 50, report: content.text })
    }
  }

  return NextResponse.json({ score: 0, report: 'Something went wrong' })
}