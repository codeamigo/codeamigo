import InputField from '@components/Form/InputField';
import { useLoginMutation, useModalQuery } from '@generated/graphql';
import { Form, Formik } from 'formik';
import React from 'react';

import { InitialModalState, modalVar } from '../../apollo/cache';
import { toErrorMap } from '../../utils';

const Login: React.FC = () => {
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
      {({ isSubmitting }) => (
        <Form>
          <div className="max-w-2xl mx-auto py-6 sm:px-6">
            <h1 className="text-2xl text-blue-800 font-semibold justify-center flex mb-4">
              Login
            </h1>
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid gap-6">
                <InputField
                  label="Email or username"
                  name="usernameOrEmail"
                  type="text"
                />
                <InputField label="Password" name="password" type="password" />
              </div>
            </div>
            <div className="px-4 py-3 text-right sm:px-6">
              <button
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
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

export default Login;
