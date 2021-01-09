import InputField from '@components/Form/InputField';
import { useLoginMutation } from '@generated/graphql';
import { Form, Formik } from 'formik';
import React from 'react';

import { useApp } from '../../state2';
import { toErrorMap } from '../../utils';

const Login: React.FC = () => {
  const [login, { data }] = useLoginMutation();
  const { actions, state } = useApp();

  return (
    <Formik
      initialValues={{ password: '', usernameOrEmail: '' }}
      onSubmit={async (values, { setErrors }) => {
        const { data } = await login({
          refetchQueries: ['Me'],
          variables: values,
        });
        if (data?.login.errors) {
          setErrors(toErrorMap(data.login.errors));
        }

        if (data?.login.user) {
          state.modal.callback();
          actions.modal.resetModal();
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
