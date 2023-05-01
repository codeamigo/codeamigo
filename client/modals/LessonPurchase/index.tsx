import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { InitialModalState, ModalType, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import { useMeQuery } from '👨‍💻generated/graphql';
import { getStripe } from '👨‍💻utils/stripe';

const LessonPurchase: React.FC = () => {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data } = modalVar() as ModalType;

  const router = useRouter();

  useEffect(() => {
    if (meLoading) return;
    if (!meData?.me) {
      modalVar({
        callback: () => null,
        data: {
          purchaseRequired: true,
        },
        name: 'login',
        persistent: true,
      });
    }
  }, [meLoading]);

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    const response = await fetch('/api/checkout-sessions', {
      body: JSON.stringify({
        amount: Number(9.99),
        cancel_url: data.cancelUrl,
        customer_id: data.userId,
        success_url: data.successUrl,
        title: data.title,
      }),
      method: 'POST',
    });

    if (response.status === 500) {
      console.error(response);
      return;
    }

    const body = await response.json();

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      //   @ts-ignore
      sessionId: body.id,
    });

    setPurchaseLoading(false);
  };

  return (
    <div className="mx-auto min-w-[300px] max-w-[300px] p-4 sm:min-w-[320px]">
      <h1 className="mb-2 flex items-end justify-center text-xl font-semibold text-white">
        Purchase Lesson
      </h1>
      <div className="text-center text-xs text-neutral-500">
        To continue please purchase this lesson. 60% off for waitlist users.
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          className="flex h-[100px] w-[100px] flex-col items-center justify-center"
          disabled={purchaseLoading}
          onClick={() => handlePurchase()}
        >
          <span className="mb-2 text-xs text-neutral-500 line-through">
            $25.00
          </span>
          <span className="text-2xl text-blue-600">$9.99</span>
        </Button>
      </div>
      <div className="mt-4 text-[10px] text-neutral-500">
        By purchasing this lesson you get access to:
        <ul className="list-inside list-disc">
          <li>💁 On-call support with a co-founder</li>
          <li>💸 60% off the future lesson price</li>
          <li>🤖 AI chatbot assistant</li>
        </ul>
      </div>
      <div className="mt-4 flex w-full justify-center text-xs text-neutral-500">
        <span
          className="text-xs text-red-600"
          onClick={() => {
            modalVar(InitialModalState);
            router.push('/');
          }}
          role="button"
        >
          Exit
        </span>
      </div>
    </div>
  );
};

export default LessonPurchase;
