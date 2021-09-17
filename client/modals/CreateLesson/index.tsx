import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import { useCreateLessonMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const templates: {
  id: string;
  imageSlug: string;
  name: string;
  value: string;
}[] = [
  {
    id: 'react-template',
    imageSlug: 'react',
    name: 'React TypeScript',
    value: 'react',
  },
  {
    id: 'angular-template',
    imageSlug: 'angular',
    name: 'Angular',
    value: 'angular',
  },
  {
    id: 'vue-template',
    imageSlug: 'vue',
    name: 'Vue 3.0',
    value: 'vue',
  },
  {
    id: 'html-template',
    imageSlug: 'html-5',
    name: 'HTML/CSS',
    value: 'html',
  },
  {
    id: 'typescript-template',
    imageSlug: 'typescript-icon',
    name: 'Vanilla TypeScript',
    value: 'typescript',
  },
  {
    id: 'javascript-template',
    imageSlug: 'javascript',
    name: 'Vanilla JavaScript',
    value: 'javascript',
  },
];

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
      {({ isSubmitting, values }) => {
        return (
          <Form>
            <div className="max-w-2xl mx-auto p-6 lg:px-8">
              <h1 className="text-xl font-semibold flex mb-4 text-text-primary">
                New Lesson
              </h1>
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
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map((template) => {
                      return (
                        <label
                          className={`w-full flex ${
                            values.template === template.value
                              ? 'shadow-md'
                              : 'shadow-sm'
                          } hover:shadow-md transition-shadow duration-300 items-center p-2 border rounded-md cursor-pointer`}
                          htmlFor={template.id}
                          key={template.id}
                        >
                          <Field
                            id={template.id}
                            name="template"
                            type="radio"
                            value={template.value}
                          />{' '}
                          <div className="flex flex-col items-start ml-2">
                            <img
                              className="h-6 mt-1"
                              src={`https://raw.githubusercontent.com/gilbarbara/logos/master/logos/${template.imageSlug}.svg`}
                            />
                            <div className="text-sm text-text-primary font-semibold mt-0.5">
                              {template.name}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button></button>
              <div className="text-right">
                <Button
                  className="inline-flex"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Let's Go!
                </Button>
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
