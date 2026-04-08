import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { sessionId } = req.body;

    if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (session.payment_status === 'paid' || session.status === 'complete') {
      const customer = session.customer;
      const subscription = session.subscription;

      res.status(200).json({
        access: true,
        customerId: typeof customer === 'string' ? customer : customer.id,
        email: session.customer_email || session.customer_details?.email,
        subscriptionId: typeof subscription === 'string' ? subscription : subscription?.id,
        referralCode: typeof customer === 'string' ? customer : customer.id, // Their customer ID IS their referral code
        trialEnd: subscription?.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      });
    } else {
      res.status(200).json({ access: false, reason: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: err.message });
  }
}
