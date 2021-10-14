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
          <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
            <h1 className="flex justify-center mb-4 text-2xl font-semibold text-text-primary">
              Login
            </h1>
            <div className="flex gap-6 justify-center">
              <button
                className="w-7 h-7"
                onClick={() => signIn('google', { callbackUrl: router.asPath })}
                type="button"
              >
                <Image src={googlePng} />
              </button>
              <button
                className="block w-7 h-7 rounded-full bg-bg-nav-offset"
                onClick={() => signIn('github', { callbackUrl: router.asPath })}
                style={{ padding: '2px' }}
                type="button"
              >
                <Image src={githubPng} />
              </button>
            </div>
            <div className="sm:p-6 px-4">
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
                    className="absolute top-0.5 right-0 text-xs underline cursor-pointer text-text-primary"
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
            <div className="px-4 sm:px-6 w-full">
              <Button
                className="justify-center w-full"
                disabled={isSubmitting || loading}
                type="submit"
              >
                Login
              </Button>
              <div className="my-1 mt-3 w-full text-xs text-center text-text-primary">
                or
              </div>
              <button
                className="justify-center w-full text-sm font-medium rounded-md focus:outline-none text-accent"
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
