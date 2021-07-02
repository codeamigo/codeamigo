import { Form, Formik } from 'formik';
import React from 'react';

import Button from '👨‍💻components/Button';
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
              <Button
                className="justify-center"
                disabled={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

type Props = {};

export default ChangeEmail;
