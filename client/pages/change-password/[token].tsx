import { Context } from '@apollo/client';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import InputField from '../../components/Form/InputField';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils';

const ChangePassword: NextPage<{ token: string }> = (props) => {
  const router = useRouter();
  const [changePassword, { data }] = useChangePasswordMutation();

  return (
    <Formik
      initialValues={{ newPassword: '', token: props.token }}
      onSubmit={async (values, { setErrors }) => {
        const { data } = await changePassword({
          variables: {
            ...values,
          },
        });
        if (data?.changePassword.errors) {
          setErrors(toErrorMap(data.changePassword.errors));
        }

        if (data?.changePassword.user) {
          router.push('/');
        }
      }}
    >
      {({ errors, isSubmitting }) => (
        <Form>
          <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl text-blue-800 font-semibold justify-center flex mb-4">
              Change Password
            </h1>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid gap-6">
                  <InputField
                    label="New password"
                    name="newPassword"
                    type="password"
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

ChangePassword.getInitialProps = ({ query }) => ({
  token: query.token as string,
});

export default ChangePassword;
