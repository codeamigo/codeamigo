import { Field, Form, Formik } from 'formik';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import { setDonations } from '👨‍💻apollo/localStorage';
import Button from '👨‍💻components/Button';
import { getStripe } from '👨‍💻utils/stripe';

const donations = [
  { amount: '1', description: '$1.00' },
  { amount: '5', description: '$5.00' },
  { amount: '10', description: '$10.00' },
];

const Donate: React.FC<Props> = () => {
  return (
    <Formik
      initialValues={{ amount: '5', dontAskAgain: false, noAmount: false }}
      onSubmit={async (values) => {
        // Create a Checkout Session.
        const response = await fetch('/api/checkout_sessions', {
          body: JSON.stringify({
            amount: Number(values.amount),
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
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message);
      }}
    >
      {({ handleChange, setFieldValue, values }) => (
        <Form>
          <div className="p-6 lg:px-8 mx-auto max-w-lg">
            <h1 className="flex mb-1 text-xl font-semibold text-text-primary">
              💰 Donate (Pay what you want)
            </h1>
            <div className="text-sm text-text-primary">
              codeamigo is completely free to use, however, in order to fund the
              teachers and development of codeamigo we ask that you donate what
              you can.
            </div>

            <div
              className={`grid grid-cols-3 gap-3 my-4 ${
                values.noAmount ? 'opacity-75 pointer-events-none' : ''
              }`}
            >
              {donations.map((donation) => {
                return (
                  <label
                    className={`w-full relative ${
                      values.amount === donation.amount
                        ? 'border-bg-nav-offset'
                        : 'border-transparent'
                    } hover:border-bg-nav-offset transition-all border-2 duration-300 items-center bg-bg-nav-faded p-2 rounded-md cursor-pointer`}
                    htmlFor={donation.description}
                    key={donation.description}
                  >
                    <Field
                      id={donation.description}
                      name="amount"
                      required
                      type="radio"
                      value={donation.amount}
                    />{' '}
                    <div className="flex items-center ml-2 h-12">
                      <div className="absolute top-1/2 left-1/2 mt-0.5 text-xl font-bold text-text-primary transform -translate-x-1/2 -translate-y-1/2">
                        {donation.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-2 items-center">
              <Field
                id="noAmount"
                name="noAmount"
                onChange={(e: React.ChangeEvent<any>) => {
                  handleChange(e);
                  if (e.target.checked) {
                    setFieldValue('amount', null);
                  }
                }}
                type="checkbox"
              />
              <label
                className="text-sm font-semibold text-text-primary"
                htmlFor="noAmount"
              >
                I would prefer not to donate.
              </label>
            </div>
            <div className="flex gap-2 items-center mt-1">
              <Field id="dontAskAgain" name="dontAskAgain" type="checkbox" />
              <label
                className="text-sm font-semibold text-text-primary"
                htmlFor="dontAskAgain"
              >
                Don't ask me again.
              </label>
            </div>
            <div className="flex gap-3 justify-end items-center">
              <div
                className="text-sm font-semibold text-text-primary underline cursor-pointer"
                onClick={() => {
                  modalVar(InitialModalState);
                  setDonations({
                    dontAskAgain: values.dontAskAgain,
                    hasDonated: false,
                    lastSeenModal: new Date().getTime(),
                  });
                }}
                role="button"
              >
                Close
              </div>
              <Button
                disabled={!values.amount}
                nature="secondary"
                type="submit"
              >
                Donate{' '}
                {donations.find((d) => d.amount === values.amount)?.description}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default Donate;
