import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
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
  const [
    forgotPassword,
    { data: forgotPasswordData, loading },
  ] = useForgotPasswordMutation();
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
          <div className="max-w-lg mx-auto p-6 lg:px-8">
            <h1 className="text-2xl text-text-primary font-semibold justify-center flex mb-4">
              Login
            </h1>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => signIn('google', { callbackUrl: router.asPath })}
                type="button"
              >
                <img className="h-7" src={googlePng} />
              </button>
              <button
                className="bg-bg-nav-offset"
                onClick={() => signIn('github', { callbackUrl: router.asPath })}
                type="button"
              >
                <img className="h-7" src={githubPng} />
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
                    className="absolute top-0.5 right-0 text-text-primary text-xs cursor-pointer underline"
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
            <div className="px-4 w-full sm:px-6">
              <Button
                className="w-full justify-center"
                disabled={isSubmitting || loading}
                type="submit"
              >
                Login
              </Button>
              <div className="text-xs w-full text-text-primary text-center my-1 mt-3">
                or
              </div>
              <button
                className="w-full justify-center text-sm font-medium rounded-md text-accent focus:outline-none"
                disabled={isSubmitting || loading}
                onClick={() =>
                  modalVar({ callback: () => null, name: 'register' })
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
