import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import React, { useEffect } from 'react';

import { InitialModalState, ModalType, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';
import { getStripe } from '👨‍💻utils/stripe';

const LessonPurchase: React.FC = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [forgotPassword, { data: forgotPasswordData, loading }] =
    useForgotPasswordMutation();
  const { data } = modalVar() as ModalType;

  useEffect(() => {
    if (forgotPasswordData?.forgotPassword) {
      modalVar({
        callback: () => null,
        data: forgotPasswordData?.forgotPassword,
        name: 'resetPasswordSent',
      });

      return;
    }

    // no email
    if (forgotPasswordData?.forgotPassword === '') {
      window.alert(
        'Sorry, we could not find an email address for this account.'
      );
    }
  }, [forgotPasswordData]);

  const handlePurchase = async () => {
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
  };

  return (
    <>
      <Formik
        initialValues={{ password: '', usernameOrEmail: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await login({
            awaitRefetchQueries: true,
            refetchQueries: ['Me'],
            variables: values,
          });
          if (data?.login.errors) {
            setErrors(toErrorMap(data.login.errors));
          }

          if (data?.login.user) {
            // @ts-ignore
            modalData?.modal?.callback();
            modalVar(InitialModalState);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="mx-auto min-w-[300px] p-4 sm:min-w-[320px]">
              <h1 className="mb-4 flex items-end justify-center text-xl font-semibold text-white">
                Login or Create an Account
              </h1>
              <div className="w-full">
                <div className="flex w-full flex-col gap-3">
                  <InputField
                    className="w-full"
                    label="Email or username"
                    name="usernameOrEmail"
                    placeholder="margaret_hamilton"
                    type="text"
                  />
                  <div
                    className={`relative ${
                      values.usernameOrEmail ? '' : 'hidden'
                    }`}
                  >
                    <InputField
                      label="Password"
                      name="password"
                      type="password"
                    />
                    <div
                      className="absolute right-0 top-0.5 cursor-pointer text-xs text-white underline"
                      onClick={() =>
                        forgotPassword({
                          variables: {
                            usernameOrEmail: values.usernameOrEmail,
                          },
                        })
                      }
                    >
                      Forgot password?
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 w-full">
                <Button
                  className="w-full justify-center"
                  disabled={isSubmitting || loading}
                  type="submit"
                >
                  Login
                </Button>
                <div className="my-3 w-full border-t-2 border-dotted border-neutral-500 text-center text-xs text-white" />
                <div className="flex items-center justify-center gap-8">
                  <button
                    className="flex items-center gap-2"
                    onClick={() =>
                      signIn('google', { callbackUrl: router.asPath })
                    }
                    type="button"
                  >
                    <span className="h-6 w-6">
                      <Image src={googlePng} />
                    </span>
                    <pre className="text-xs text-white">Google</pre>
                  </button>
                  <button
                    className="flex items-center gap-2"
                    onClick={() =>
                      signIn('github', { callbackUrl: router.asPath })
                    }
                    style={{ padding: '2px' }}
                    type="button"
                  >
                    <span className="h-6 w-6">
                      <Image src={githubPng} />
                    </span>
                    <pre className="text-xs text-white">GitHub</pre>
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div>
        <div>
          <Button onClick={() => handlePurchase()}>Purchase</Button>
        </div>
      </div>
    </>
  );
};

export default LessonPurchase;
