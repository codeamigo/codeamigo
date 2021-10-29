import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { templates } from '👨‍💻modals/CreateLesson';

const Languages: React.FC<Props> = () => {
  const router = useRouter();

  return (
    <div className="p-2 rounded-md bg-bg-nav">
      <h4 className="mb-2 font-semibold text-text-primary">Languages</h4>
      <Formik
        initialValues={{
          checked: [] as string[],
        }}
        onSubmit={() => Promise.resolve()}
        validate={(values) => {
          router.replace({
            pathname: '/',
            query: {
              ...router.query,
              deps: values.checked.join('|'),
            },
          });
        }}
      >
        {({ values }) => (
          <Form>
            {templates.map(({ imageUrl, name, value }) => {
              return (
                <label
                  className="flex justify-between mb-0.5 text-sm font-bold cursor-pointer"
                  htmlFor={value}
                  key={value}
                >
                  <div>
                    <Field
                      id={value}
                      name="checked"
                      type="checkbox"
                      value={value}
                    />{' '}
                    <div className="inline-block text-text-primary">
                      <div className="flex items-center ml-1">
                        {name}
                        <img className="ml-3 h-4" src={imageUrl} />
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </Form>
        )}
      </Formik>
    </div>
  );
};

type Props = {};

export default Languages;
