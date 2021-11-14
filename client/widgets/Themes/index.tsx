import { Field, Formik } from 'formik';
import React from 'react';
import { mapTheme } from 'styles/appThemes/utils';

import { useMeQuery, useUpdateUserThemeMutation } from '👨‍💻generated/graphql';

import { themes } from '../../styles/appThemes';
import themeList from '../../styles/monacoThemes/themelist.json';

const Themes: React.FC<Props> = () => {
  const { data } = useMeQuery();
  const [updateUserTheme] = useUpdateUserThemeMutation({
    refetchQueries: ['Me'],
  });

  if (!data?.me?.theme) return null;

  return (
    <div>
      <div>
        <h2 className="mb-3 text-xl font-bold underline text-text-primary">
          Choose Theme
        </h2>
        <Formik initialValues={{ theme: data.me.theme }} onSubmit={() => {}}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {Object.keys(themes).map((theme) => {
              const mTheme = mapTheme(themes[theme]);

              return (
                <label
                  className="py-3 px-2 w-full rounded-md border cursor-pointer"
                  htmlFor={`${theme}-template`}
                  onClick={() => updateUserTheme({ variables: { theme } })}
                  style={{
                    background: mTheme['--bg-primary'],
                    border: `2px solid ${mTheme['--bg-nav-offset']}`,
                  }}
                >
                  <div className="flex items-center">
                    <Field
                      id={`${theme}-template`}
                      name="theme"
                      type="radio"
                      value={theme}
                    />{' '}
                    <div className="flex flex-col items-start ml-2">
                      <div
                        className="text-sm font-semibold"
                        style={{ color: mTheme['--text-primary'] }}
                      >
                        {/* @ts-ignore */}
                        {themeList[theme]}
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-3 w-20 h-3 rounded-full"
                    style={{ background: mTheme['--bg-nav'] }}
                  ></div>
                  <div
                    className="mt-3 w-28 h-3 rounded-full"
                    style={{ background: mTheme['--accent'] }}
                  ></div>
                </label>
              );
            })}
          </div>
        </Formik>
      </div>
    </div>
  );
};

type Props = {};

export default Themes;
