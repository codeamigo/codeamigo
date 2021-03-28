import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import InputField from '👨‍💻components/Form/InputField';
import {
  useChangePasswordFromTokenMutation,
  useLoginMutation,
} from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const ChangePassword: React.FC<Props> = () => {
  const router = useRouter();
  const tempPw = modalVar().data;
  const [changePasswordFromToken] = useChangePasswordFromTokenMutation();
  const [login] = useLoginMutation();

  return (
    <Formik
      initialValues={{ newPassword: '', tempPw }}
      onSubmit={async (values, { setErrors }) => {
        const { data } = await changePasswordFromToken({
          variables: {
            ...values,
            token: tempPw,
          },
        });
        if (data?.changePasswordFromToken.errors) {
          setErrors({
            newPassword: toErrorMap(data.changePasswordFromToken.errors).token,
          });
        }

        if (data?.changePasswordFromToken.user) {
          login({
            awaitRefetchQueries: true,
            refetchQueries: ['Me'],
            variables: {
              password: values.newPassword,
              usernameOrEmail: data.changePasswordFromToken.user.username,
            },
          });

          router.push('/');
          modalVar(InitialModalState);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="max-w-lg mx-auto p-6 lg:px-8">
          <h1 className="text-2xl text-text-primary font-semibold justify-center flex mb-4">
            Change Password
          </h1>
          <div className="px-4 sm:p-6">
            <div className="grid gap-3">
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
              ></InputField>
            </div>
          </div>
          <div className="px-4 sm:px-6">
            <button
              className="w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
              type="submit"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default ChangePassword;
