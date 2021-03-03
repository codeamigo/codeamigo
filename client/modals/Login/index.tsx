import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import { useLoginMutation, useModalQuery } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const Login: React.FC = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const { data: modalData } = useModalQuery();

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
          <div className="max-w-lg mx-auto py-6 sm:px-6">
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
                onClick={() => signIn('github', { callbackUrl: router.asPath })}
                type="button"
              >
                <img className="h-7" src={githubPng} />
              </button>
            </div>
            <div className="px-4 sm:p-6">
              <div className="grid gap-3">
                <InputField
                  label="Email or username"
                  name="usernameOrEmail"
                  type="text"
                />
                <InputField
                  className={values.usernameOrEmail ? '' : 'hidden'}
                  label="Password"
                  name="password"
                  type="password"
                />
              </div>
            </div>
            <div className="px-4 w-full sm:px-6">
              <Button
                className="w-full justify-center"
                disabled={isSubmitting}
                type="submit"
              >
                Login
              </Button>
              <div className="text-xs w-full text-text-primary text-center my-1 mt-3">
                or
              </div>
              <button
                className="w-full justify-center text-sm font-medium rounded-md text-accent focus:outline-none"
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
