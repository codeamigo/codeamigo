import { Form, Formik } from 'formik';
import React from 'react';
import { generateTheme } from 'styles/appThemes';
import { mapTheme } from 'styles/appThemes/utils';

import InputField from '👨‍💻components/Form/InputField';
import { useUpdateUserThemeMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

import { themes } from '../../styles/appThemes';
import themeList from '../../styles/monacoThemes/themelist.json';

const Settings: React.FC<Props> = () => {
  const [updateUserTheme] = useUpdateUserThemeMutation({
    refetchQueries: ['Me'],
  });

  return (
    <div>
      <div>
        <h2 className="underline text-xl text-text-primary font-bold mb-3">
          Choose Theme
        </h2>
        {/* <Formik
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
        </Formik> */}
        <div className="grid grid-cols-4 gap-10">
          {Object.keys(themes).map((theme) => {
            const mTheme = mapTheme(themes[theme]);

            return (
              <div
                className="h-32 w-full rounded-lg p-3"
                onClick={() => updateUserTheme({ variables: { theme } })}
                style={{
                  background: mTheme['--bg-primary'],
                  border: `2px solid ${mTheme['--bg-nav-offset']}`,
                }}
              >
                <div
                  className="font-semibold"
                  style={{ color: mTheme['--text-primary'] }}
                >
                  {/* @ts-ignore */}
                  {themeList[theme]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

type Props = {};

export default Settings;
