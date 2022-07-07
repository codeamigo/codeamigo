import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

const SortBy: React.FC<Props> = () => {
  const router = useRouter();

  return (
    <div className="p-2 mb-2 rounded-md bg-bg-nav">
      <h4 className="mb-2 text-lg font-semibold underline text-text-primary">
        Sort By
      </h4>
      <Formik
        initialValues={{
          checked: 'views-desc',
        }}
        onSubmit={() => Promise.resolve()}
        validate={(values) => {
          router.replace({
            pathname: '/',
            query: {
              ...router.query,
              sortBy: values.checked,
            },
          });
        }}
      >
        {({ resetForm, values }) => (
          <Form>
            {[
              {
                name: 'Most Viewed',
                value: 'views-desc',
              },
              {
                name: 'Most Recent',
                value: 'createdAt-desc',
              },
              {
                name: 'Oldest',
                value: 'createdAt-asc',
              },
            ].map((setting) => {
              return (
                <label
                  className="flex justify-between mb-0.5 text-sm font-light cursor-pointer"
                  htmlFor={setting.value}
                  key={setting.name}
                >
                  <div>
                    <Field
                      id={setting.value}
                      name="checked"
                      type="radio"
                      value={setting.value}
                    />{' '}
                    <div className="inline-block text-text-primary">
                      <div className="flex items-center ml-1">
                        {setting.name}
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
            {values.checked && (
              <div
                className="mt-1 text-sm text-accent"
                onClick={() => {
                  resetForm();
                  router.replace({
                    pathname: '/',
                    query: {
                      ...router.query,
                      sortBy: '',
                    },
                  });
                }}
                role="button"
              >
                Clear
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

type Props = {};

export default SortBy;
