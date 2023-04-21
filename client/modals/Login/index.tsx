import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import React, { useEffect } from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useModalQuery,
} from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const Login: React.FC = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [forgotPassword, { data: forgotPasswordData, loading }] =
    useForgotPasswordMutation();
  const { data: modalData } = useModalQuery();

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

  return (
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
          <div className="mx-auto w-96 max-w-lg p-6 lg:px-4">
            <h1 className="text-text-primary mb-4 flex justify-center text-2xl font-semibold">
              Login
            </h1>
            <div className="flex justify-center gap-6">
              <button
                className="h-8 w-8"
                onClick={() => signIn('google', { callbackUrl: router.asPath })}
                type="button"
              >
                <Image src={googlePng} />
              </button>
              <button
                className="bg-bg-nav-offset block h-8 w-8 rounded-full"
                onClick={() => signIn('github', { callbackUrl: router.asPath })}
                style={{ padding: '2px' }}
                type="button"
              >
                <Image src={githubPng} />
              </button>
            </div>
            <div className="px-4 sm:p-6">
              <div className="flex flex-col gap-3">
                <InputField
                  label="Email or username"
                  name="usernameOrEmail"
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
                    className="text-text-primary absolute right-0 top-0.5 cursor-pointer text-xs underline"
                    onClick={() =>
                      forgotPassword({
                        variables: { usernameOrEmail: values.usernameOrEmail },
                      })
                    }
                  >
                    Forgot password?
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 sm:px-6">
              <Button
                className="w-full justify-center"
                disabled={isSubmitting || loading}
                type="submit"
              >
                Login
              </Button>
              <div className="text-text-primary my-1 mt-3 w-full text-center text-xs">
                or
              </div>
              <button
                className="text-accent w-full justify-center rounded-md text-sm font-medium focus:outline-none"
                disabled={isSubmitting || loading}
                onClick={() =>
                  modalVar({
                    callback: () => null,
                    name: 'register',
                    persistent: false,
                  })
                }
                type="button"
              >
                Create Account
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
