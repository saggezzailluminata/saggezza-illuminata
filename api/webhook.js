import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse the event directly from body (Vercel already parses JSON)
  let event;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (err) {
    console.error('Parse error:', err.message);
    return res.status(400).json({ error: 'Bad payload' });
  }

  console.log('Webhook event:', event.type);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const referralCode = session.metadata?.referral_code || '';
      const customerEmail = session.customer_email || session.customer_details?.email || '';

      console.log('New sub:', customerEmail);
      console.log('Referral code:', referralCode);

      if (referralCode && referralCode.startsWith('cus_')) {
        console.log('Processing referral for:', referralCode);

        const referrer = await stripe.customers.retrieve(referralCode);
        if (referrer && !referrer.deleted) {
          const credits = parseInt(referrer.metadata?.referral_credits || '0');
          const count = parseInt(referrer.metadata?.referral_count || '0');
          await stripe.customers.update(referralCode, {
            metadata: {
              referral_credits: String(credits + 10),
              referral_count: String(count + 1),
              last_referral: customerEmail,
              last_referral_date: new Date().toISOString(),
            },
          });
          console.log('SUCCESS: Credited 10 EUR to', referrer.email);
        }
      } else {
        console.log('No referral code found');
      }
    }
  } catch (err) {
    console.error('Handler error:', err.message);
  }

  res.status(200).json({ received: true });
}
