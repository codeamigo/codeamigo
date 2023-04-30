import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { formatAmountForStripe } from '👨‍💻utils/stripe';

import { CURRENCY } from './config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const request = JSON.parse(req.body);
      const amount: number = request.amount;

      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        cancel_url: request.cancel_url,
        client_reference_id: request.customer_id,
        line_items: [
          {
            price_data: {
              currency: CURRENCY,
              product_data: {
                description: 'You are purchasing ' + request.title,
                name: 'Amount',
              },
              unit_amount: formatAmountForStripe(amount, CURRENCY),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        payment_method_types: ['card'],
        submit_type: 'pay',
        success_url:
          request.success_url +
          '?payment=success&session_id={CHECKOUT_SESSION_ID}',
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
