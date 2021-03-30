import { Form, Formik } from 'formik';
import React from 'react';

import InputField from '👨‍💻components/Form/InputField';
import { useChangeEmailMutation, useMeQuery } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const ChangeEmail: React.FC<Props> = () => {
  const [changeEmail] = useChangeEmailMutation();
  const { data } = useMeQuery({ fetchPolicy: 'cache-and-network' });

  return (
    <div>
      <div className="md:w-1/4">
        <h2 className="underline text-xl text-text-primary font-bold mb-3">
          Change Email
        </h2>
        <Formik
          initialValues={{
            newEmail: '',
            oldEmail: data?.me?.email,
          }}
          onSubmit={async (values, { resetForm, setErrors, setValues }) => {
            const { data } = await changeEmail({
              variables: {
                ...values,
              },
            });
            if (data?.changeEmail.errors) {
              setErrors(toErrorMap(data.changeEmail.errors));
              return;
            }

            resetForm();
            setValues({ newEmail: '', oldEmail: values.newEmail });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <InputField
                disabled
                label="Current Email"
                name="oldEmail"
                type="email"
              />
              <InputField label="New Email" name="newEmail" type="email" />
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

export default ChangeEmail;
