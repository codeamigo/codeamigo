import { Field, Form, Formik } from 'formik';
import React from 'react';
import { mapTheme } from 'styles/appThemes/utils';

import InputField from '👨‍💻components/Form/InputField';
import { useMeQuery, useUpdateUserThemeMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

import { themes } from '../../styles/appThemes';
import themeList from '../../styles/monacoThemes/themelist.json';

const Settings: React.FC<Props> = () => {
  const { data } = useMeQuery();
  const [updateUserTheme] = useUpdateUserThemeMutation({
    refetchQueries: ['Me'],
  });

  if (!data?.me?.theme) return null;

  return (
    <div>
      <div className="md:w-1/4">
        <h2 className="underline text-xl text-text-primary font-bold mb-3">
          Change Password
        </h2>
        <Formik
          initialValues={{}}
          onSubmit={async (values, { setErrors }) => {
            // const { data } = await updateUserRole({
            //   variables: {
            //     // @ts-ignore
            //     id: values.id,
            //     role: 'ADMIN',
            //   },
            // });
            // if (data?.updateUserRole.errors) {
            //   setErrors(toErrorMap(data.updateUserRole.errors));
            //   return;
            // }
            // window.alert(
            //   `${data?.updateUserRole.user?.username} is now an ADMIN.`
            // );
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <InputField
                label="Current Password"
                name="currentPassword"
                type="text"
              />
              <InputField label="New Password" name="newPassword" type="text" />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="text"
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

export default Settings;
