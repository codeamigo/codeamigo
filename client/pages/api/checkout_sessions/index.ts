import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { formatAmountForStripe } from '👨‍💻utils/stripe';

import { CURRENCY, MIN_AMOUNT } from './config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const amount: number = JSON.parse(req.body).amount;
      // Validate the amount that was passed from the client.
      if (!(amount >= MIN_AMOUNT)) {
        throw new Error('Invalid amount.');
      }
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        cancel_url: `${req.headers.origin}/stripe-failure`,
        line_items: [
          {
            amount: formatAmountForStripe(amount, CURRENCY),
            currency: CURRENCY,
            description: 'Your donation will help keep codeamigo running!',
            name: 'Donation Amount',
            quantity: 1,
          },
        ],
        payment_method_types: ['card'],
        submit_type: 'donate',
        success_url: `${req.headers.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const error = err as unknown as { message: string };
      console.log(error.message);
      res.status(500).json({ message: error.message, statusCode: 500 });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
