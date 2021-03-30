import { Field, Form, Formik } from 'formik';
import React from 'react';
import { mapTheme } from 'styles/appThemes/utils';

import InputField from '👨‍💻components/Form/InputField';
import { useChangePasswordFromPasswordMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const ChangePassword: React.FC<Props> = () => {
  const [changePassword] = useChangePasswordFromPasswordMutation();

  return (
    <div>
      <div className="md:w-1/4">
        <h2 className="underline text-xl text-text-primary font-bold mb-3">
          Change Password
        </h2>
        <Formik
          initialValues={{
            confirmPassword: '',
            newPassword: '',
            oldPassword: '',
          }}
          onSubmit={async (values, { resetForm, setErrors }) => {
            if (values.newPassword !== values.confirmPassword) {
              setErrors({ confirmPassword: 'Passwords do not match.' });
              return;
            }

            const { data } = await changePassword({
              variables: {
                ...values,
              },
            });
            if (data?.changePasswordFromPassword.errors) {
              setErrors(toErrorMap(data.changePasswordFromPassword.errors));
              return;
            }

            resetForm();

            window.alert('Your password has been changed.');
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <InputField
                label="Current Password"
                name="oldPassword"
                type="password"
              />
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
              />
              <button
                className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

type Props = {};

export default ChangePassword;
