import * as githubPng from 'assets/github.png';
import * as googlePng from 'assets/google.png';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { posthog } from 'posthog-js';
import React, { useEffect } from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import Icon from '👨‍💻components/Icon';
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const LoginError: React.FC = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [forgotPassword, { data: forgotPasswordData, loading }] =
    useForgotPasswordMutation();
  const { data: modalData } = modalVar();

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
        posthog.capture('login', {
          method: 'email',
        });

        if (data?.login.errors) {
          setErrors(toErrorMap(data.login.errors));
        }

        if (data?.login.user) {
          // @ts-ignore
          modalData?.modal?.callback();
          modalVar(InitialModalState);
          window.location.reload();
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <div className="mx-auto min-w-[300px] max-w-[300px] p-4">
            <Icon className="mx-auto h-8 w-8 text-red-500" name="alert" />
            <h1 className="mb-2 flex items-end justify-center text-xl font-semibold text-white">
              Login Error
            </h1>
            <div className="mb-4 mt-1 text-center text-xs text-neutral-500">
              We had trouble logging you in.
            </div>
            <div className="mt-2 w-full">
              <div className="mt-4 flex w-full justify-center text-xs">
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
                  Try Again
                </span>
              </div>
              <div className="mt-3 flex w-full justify-center text-xs">
                <span
                  className="text-xs text-red-600"
                  onClick={() => {
                    modalVar(InitialModalState);
                  }}
                  role="button"
                >
                  Exit
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginError;
