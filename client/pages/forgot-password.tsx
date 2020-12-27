import { Form, Formik } from 'formik';
import React from 'react';

import InputField from '../components/Form/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import withApollo from '../utils/withApollo';

const ForgotPassword: React.FC<Props> = () => {
  const [forgotPassword, { data }] = useForgotPasswordMutation();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values, { setErrors, setStatus }) => {
        const { data } = await forgotPassword({ variables: values });
        if (!data?.forgotPassword) {
          return setErrors({
            email: 'Could not reset password. Try a different email.',
          });
        }

        setStatus('success');
      }}
    >
      {({ isSubmitting, status }) => (
        <Form>
          <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
            {status === 'success' ? (
              <h1 className="text-2xl text-green-600 font-semibold justify-center flex mb-4">
                Password reset link sent!
              </h1>
            ) : (
              <>
                <h1 className="text-2xl text-blue-800 font-semibold justify-center flex mb-4">
                  Forgot Password
                </h1>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid gap-6">
                      <InputField label="Email" name="email" type="email" />
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default withApollo({ ssr: false })(ForgotPassword);
