import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '../../../../lib/supabaseServer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  const body = await request.text()

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe signature or webhook secret missing' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Webhook validation failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const sessionId = session.id
    const userId = session.metadata?.userId

    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items.data.price'],
      })

      const priceId = checkoutSession.line_items?.data[0]?.price?.id || session.metadata?.priceId
      const plan = priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
        ? 'premium'
        : priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
        ? 'pro'
        : 'free'

      const isPremium = plan === 'premium'
      const isPro = plan === 'pro' || isPremium

      if (userId) {
        await supabaseServer
          .from('profiles')
          .upsert({
            user_id: userId,
            plan,
            is_pro: isPro,
            is_premium: isPremium,
          }, { onConflict: 'user_id' })
      } else {
        console.warn('Webhook received checkout session without userId metadata')
      }
    } catch (error) {
      console.error('Failed to sync subscription profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
