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
          <div className="mx-auto w-96 max-w-lg p-6 lg:px-4">
            <h1 className="text-white mb-4 flex justify-center text-2xl font-semibold">
              Sign Up
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
                className="w-full justify-center"
                disabled={isSubmitting || !isValid}
                type="submit"
              >
                Register
              </Button>
              <div className="text-white my-1 mt-3 w-full text-center text-xs">
                or
              </div>
              <button
                className="text-neutral-500 w-full justify-center rounded-md text-sm font-medium focus:outline-none"
                onClick={() =>
                  modalVar({
                    callback: modalVar().callback,
                    name: 'login',
                    persistent: false,
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
