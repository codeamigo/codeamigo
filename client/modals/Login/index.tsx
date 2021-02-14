import { Form, Formik } from 'formik';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import { useLoginMutation, useModalQuery } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

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
          <div className="max-w-lg mx-auto py-6 sm:px-6">
            <h1 className="text-2xl text-blue-800 font-semibold justify-center flex mb-4">
              Login
            </h1>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid gap-6">
                <InputField
                  label="Email or username"
                  name="usernameOrEmail"
                  type="text"
                />
                <InputField label="Password" name="password" type="password" />
              </div>
            </div>
            <div className="px-4 py-3 w-full sm:px-6">
              <Button
                className="w-full justify-center"
                disabled={isSubmitting}
                type="submit"
              >
                Login
              </Button>
              <div className="text-xs w-full text-text-primary text-center my-1">
                or
              </div>
              <button
                className="w-full justify-center text-sm font-medium rounded-md text-accent focus:outline-none"
                onClick={() =>
                  modalVar({ callback: () => null, name: 'register' })
                }
                type="button"
              >
                Create Account
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
