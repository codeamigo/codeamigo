import InputField from '@components/Form/InputField';
import { useRegisterMutation } from '@generated/graphql';
import { Form, Formik } from 'formik';
import React from 'react';

import { useApp } from '../../state2';
import { toErrorMap } from '../../utils';

const Register: React.FC = () => {
  const { actions, state } = useApp();
  const [register, { data }] = useRegisterMutation();

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
          state.modal.callback();
          actions.modal.resetModal();
        }
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl text-blue-800 font-semibold justify-center flex mb-4">
              Register
            </h1>
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid gap-6">
                <InputField
                  label="Username"
                  name="username"
                  required
                  type="text"
                />
                <InputField label="Email" name="email" required type="email" />
                <InputField
                  label="Password"
                  name="password"
                  required
                  type="password"
                />
              </div>
            </div>
            <div className="px-4 py-3 text-right sm:px-6">
              <button
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isSubmitting || !isValid}
                type="submit"
              >
                Register
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
