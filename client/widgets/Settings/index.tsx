import { Form, Formik } from 'formik';
import React from 'react';

import InputField from '👨‍💻components/Form/InputField';
import { useUpdateUserThemeMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const Settings: React.FC<Props> = () => {
  const [updateUserTheme] = useUpdateUserThemeMutation({
    refetchQueries: ['Me'],
  });

  return (
    <div>
      <div className="md:w-1/4">
        <h2 className="underline text-xl text-primary font-bold mb-3">
          Create Admin
        </h2>
        <Formik
          initialValues={{ theme: '' }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await updateUserTheme({
              variables: {
                theme: values.theme,
              },
            });
            if (data?.updateUserTheme.errors) {
              setErrors(toErrorMap(data.updateUserTheme.errors));
              return;
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField label="Theme" name="theme" type="text" />
              <button
                className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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

export default Settings;
