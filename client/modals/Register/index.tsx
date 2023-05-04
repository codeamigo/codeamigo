import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
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
          window.location.reload();
        }
      }}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form>
          <div className="mx-auto min-w-[300px] p-4 sm:min-w-[320px]">
            <h1 className="mb-4 flex items-end justify-center text-xl font-semibold text-white">
              Create an Account
            </h1>
            <div className="w-full">
              <div className="flex w-full flex-col gap-3">
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
            <div className="mt-2 w-full">
              <Button
                className="w-full justify-center"
                disabled={isSubmitting || !isValid}
                type="submit"
              >
                Register
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
              <div className="mt-4 flex w-full justify-center text-xs text-neutral-500">
                Already have an account?&nbsp;
                <span
                  className="text-xs text-blue-600"
                  onClick={() =>
                    modalVar({
                      callback: () => null,
                      name: 'login',
                      persistent: false,
                    })
                  }
                  role="button"
                >
                  Login
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
