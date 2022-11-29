import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
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
          <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
            <h1 className="flex justify-center mb-4 text-2xl font-semibold text-text-primary">
              Sign Up
            </h1>
            <div className="flex gap-6 justify-center">
              <button
                className="w-8 h-8"
                onClick={() => signIn('google', { callbackUrl: router.asPath })}
                type="button"
              >
                <Image src={googlePng} />
              </button>
              <button
                className="block w-8 h-8 bg-bg-nav-offset rounded-full"
                onClick={() => signIn('github', { callbackUrl: router.asPath })}
                style={{ padding: '2px' }}
                type="button"
              >
                <Image src={githubPng} />
              </button>
            </div>
            <div className="sm:p-6 px-4">
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
              <Button
                className="justify-center w-full"
                disabled={isSubmitting || !isValid}
                type="submit"
              >
                Register
              </Button>
              <div className="my-1 mt-3 w-full text-xs text-center text-text-primary">
                or
              </div>
              <button
                className="justify-center w-full text-sm font-medium text-accent rounded-md focus:outline-none"
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
