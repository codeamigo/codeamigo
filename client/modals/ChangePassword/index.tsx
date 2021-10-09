import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
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
        <Form className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
          <h1 className="flex justify-center mb-4 text-2xl font-semibold text-text-primary">
            Change Password
          </h1>
          <div className="sm:p-6 px-4">
            <div className="grid gap-3">
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
              ></InputField>
            </div>
          </div>
          <div className="px-4 sm:px-6">
            <Button disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default ChangePassword;
