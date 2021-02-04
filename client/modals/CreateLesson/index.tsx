import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import InputField from '👨‍💻components/Form/InputField';
import { useCreateLessonMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const CreateLesson: React.FC<Props> = () => {
  const router = useRouter();
  const [createLesson] = useCreateLessonMutation();

  return (
    <Formik
      initialValues={{ description: '', template: 'react', title: '' }}
      onSubmit={async (values, { setErrors }) => {
        const { data } = await createLesson({
          variables: values,
        });
        if (data?.createLesson.errors) {
          setErrors(toErrorMap(data.createLesson.errors));
        } else if (data?.createLesson.lesson) {
          modalVar({ callback: () => null, name: null });
          router.push(`/lessons/edit/${data.createLesson.lesson.id}`);
        }
      }}
    >
      {({ isSubmitting }) => {
        return (
          <Form>
            <div className="max-w-2xl mx-auto py-6 sm:px-6">
              <h1 className="text-xl font-semibold flex mb-4">New Lesson</h1>
              <div className="flex flex-col gap-4">
                <div className="w-1/2">
                  <InputField
                    label="Title"
                    maxLength={35}
                    name="title"
                    type="text"
                  />
                </div>
                <InputField
                  label="Description"
                  maxLength={90}
                  name="description"
                  type="text"
                />
                <div>
                  <label className="block text-sm font-medium text-text-primary">
                    Templates
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className="w-full flex items-center p-2 border rounded-md cursor-pointer"
                      htmlFor="react-template"
                    >
                      <Field
                        id="react-template"
                        name="template"
                        type="radio"
                        value="react"
                      />{' '}
                      <div className="flex flex-col items-start ml-2">
                        <img
                          className="h-6 mt-1"
                          src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/react.svg"
                        />
                        <div className="text-sm font-semibold">
                          React TypeScript
                        </div>
                      </div>
                    </label>
                    <label
                      className="w-full flex items-center p-2 border rounded-md cursor-pointer"
                      htmlFor="html-template"
                    >
                      <Field
                        id="html-template"
                        name="template"
                        type="radio"
                        value="html"
                      />{' '}
                      <div className="flex flex-col items-start ml-2">
                        <img
                          className="h-6 mt-1"
                          src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/html-5.svg"
                        />
                        <div className="text-sm font-semibold">HTML/CSS</div>
                      </div>
                    </label>
                    <label
                      className="w-full flex items-center p-2 border rounded-md cursor-pointer"
                      htmlFor="typescript-template"
                    >
                      <Field
                        id="typescript-template"
                        name="template"
                        type="radio"
                        value="typescript"
                      />{' '}
                      <div className="flex flex-col items-start ml-2">
                        <img
                          className="h-6 mt-1"
                          src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/typescript-icon.svg"
                        />
                        <div className="text-sm font-semibold">
                          Vanilla TypeScript
                        </div>
                      </div>
                    </label>
                    <label
                      className="w-full flex items-center p-2 border rounded-md cursor-pointer"
                      htmlFor="javascript-template"
                    >
                      <Field
                        id="javascript-template"
                        name="template"
                        type="radio"
                        value="javascript"
                      />{' '}
                      <div className="flex flex-col items-start ml-2">
                        <img
                          className="h-6 mt-1"
                          src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/javascript.svg"
                        />
                        <div className="text-sm font-semibold">
                          Vanilla JavaScript
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4 text-right">
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Go!
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

type Props = {};

export default CreateLesson;
