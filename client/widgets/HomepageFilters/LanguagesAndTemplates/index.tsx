import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { LessonTemplate } from '👨‍💻generated/graphql';
import { templates } from '👨‍💻modals/CreateLesson';

const LanguagesAndTemplates: React.FC<Props> = () => {
  const router = useRouter();

  return (
    <div className="p-2 mb-2 bg-bg-nav rounded-md">
      <h4 className="mb-2 text-lg font-semibold text-text-primary underline">
        Languages and Templates
      </h4>
      <Formik
        initialValues={{
          checked: null,
        }}
        onSubmit={() => Promise.resolve()}
        validate={(values) => {
          router.replace({
            pathname: '/',
            query: {
              ...router.query,
              template: values.checked,
            },
          });
        }}
      >
        {({ resetForm, values }) => (
          <Form>
            {Object.keys(LessonTemplate).map((t) => {
              const template = templates.find(
                (template) => template.value === t
              );
              if (!template) return null;

              return (
                <label
                  className="flex justify-between mb-0.5 text-sm font-light cursor-pointer"
                  htmlFor={t}
                  key={t}
                >
                  <div>
                    <Field id={t} name="checked" type="radio" value={t} />{' '}
                    <div className="inline-block text-text-primary">
                      <div className="flex items-center ml-1">
                        {template.name}
                        <img
                          className={`ml-2 h-4 ${
                            template.withBackground
                              ? 'bg-white rounded-full'
                              : ''
                          }`}
                          src={template.imageUrl}
                        />
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
                      template: '',
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

export default LanguagesAndTemplates;
