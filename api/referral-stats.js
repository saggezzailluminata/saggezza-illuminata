import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { customerId } = req.body;

    const customer = await stripe.customers.retrieve(customerId);

    res.status(200).json({
      referralCount: parseInt(customer.metadata?.referral_count || '0'),
      referralCredits: parseInt(customer.metadata?.referral_credits || '0'),
      lastReferral: customer.metadata?.last_referral || null,
      lastReferralDate: customer.metadata?.last_referral_date || null,
    });
  } catch (err) {
    console.error('Referral stats error:', err);
    res.status(500).json({ error: err.message });
  }
}
