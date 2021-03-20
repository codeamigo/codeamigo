import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import InputField from '👨‍💻components/Form/InputField';
import { useModalQuery, useRegisterMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const Register: React.FC = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const { data: modalData } = useModalQuery();

  return (
    <Formik
      initialValues={{ email: '', password: '', username: '' }}
      onSubmit={async (values, { setErrors }) => {
        const { data } = await register({
          refetchQueries: ['Me'],
          variables: values,
        });
        if (data?.register.errors) {
          setErrors(toErrorMap(data.register.errors));
        }

        if (data?.register.user) {
          // @ts-ignore
          modalData?.modal?.callback();
          modalVar(InitialModalState);
        }
      }}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form>
          <div className="max-w-lg mx-auto p-6 lg:px-8">
            <h1 className="text-2xl text-text-primary font-semibold justify-center flex mb-4">
              Sign Up
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
                  label="Username"
                  name="username"
                  required
                  type="text"
                />
                <InputField
                  className={values.username ? '' : 'hidden'}
                  label="Email"
                  name="email"
                  required
                  type="email"
                />
                <InputField
                  className={values.username ? '' : 'hidden'}
                  label="Password"
                  name="password"
                  required
                  type="password"
                />
              </div>
            </div>
            <div className="px-4 sm:px-6">
              <button
                className="w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting || !isValid}
                type="submit"
              >
                Register
              </button>
              <div className="text-xs w-full text-text-primary text-center my-1 mt-3">
                or
              </div>
              <button
                className="w-full justify-center text-sm font-medium rounded-md text-accent focus:outline-none"
                onClick={() =>
                  modalVar({
                    callback: modalVar().callback,
                    name: 'login',
                  })
                }
                type="button"
              >
                Login
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
