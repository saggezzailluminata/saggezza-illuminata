import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, referralCode, quizAnswers } = req.body;
    const origin = req.headers.origin || process.env.NEXT_PUBLIC_APP_URL || 'https://saggezza-illuminata.vercel.app';

    console.log('Checkout request:', { email, referralCode, problem: quizAnswers?.problem });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          referral_code: referralCode || '',
        },
      },
      metadata: {
        referral_code: referralCode || '',
      },
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${origin}?status=cancelled`,
      allow_promotion_codes: true,
    });

    console.log('Session created:', session.id, 'Referral in metadata:', referralCode || 'none');

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
