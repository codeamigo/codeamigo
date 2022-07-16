import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import { LessonTemplate, useCreateLessonMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

export const templates: {
  color: string;
  id: string;
  imageUrl: string;
  name: string;
  rounded?: boolean;
  value: string;
  withBackground?: boolean;
}[] = [
  {
    color: '#fff',
    id: 'stackblitz-template',
    imageUrl:
      'https://res.cloudinary.com/dqki6kci3/image/upload/v1657654940/wqxz9qrw6bukyghhnesf.jpg',
    name: 'Stackblitz',
    rounded: true,
    value: LessonTemplate.Stackblitz,
  },
  {
    color: '#fff',
    id: 'sandpack-template',
    imageUrl: `http://res.cloudinary.com/dqki6kci3/image/upload/v1657147466/oyxsnwyn6h7kexiybt4l.ico`,
    name: 'Sandpack',
    value: LessonTemplate.Sandpack,
  },
  {
    color: '#00d8ff',
    id: 'react-template',
    imageUrl: `https://raw.githubusercontent.com/gilbarbara/logos/master/logos/react.svg`,
    name: 'React TypeScript',
    value: LessonTemplate.React,
  },
  {
    color: '#cb2b39',
    id: 'angular-template',
    imageUrl: `https://angular.io/assets/images/logos/angular/angular.svg`,
    name: 'Angular',
    value: LessonTemplate.Angular,
  },
  {
    color: '#64b687',
    id: 'vue-template',
    imageUrl: `https://raw.githubusercontent.com/gilbarbara/logos/master/logos/vue.svg`,
    name: 'Vue 3.0',
    value: LessonTemplate.Vue,
  },
  {
    color: '#d35836',
    id: 'html-template',
    imageUrl: `https://raw.githubusercontent.com/gilbarbara/logos/master/logos/html-5.svg`,
    name: 'HTML/CSS',
    value: LessonTemplate.Html,
  },
  {
    color: '#3478c6',
    id: 'typescript-template',
    imageUrl: `https://raw.githubusercontent.com/gilbarbara/logos/master/logos/typescript-icon.svg`,
    name: 'Vanilla TypeScript',
    rounded: true,
    value: LessonTemplate.TypeScript,
  },
  {
    color: '#f3e050',
    id: 'javascript-template',
    imageUrl: `https://raw.githubusercontent.com/gilbarbara/logos/master/logos/javascript.svg`,
    name: 'Vanilla JavaScript',
    rounded: true,
    value: LessonTemplate.JavaScript,
  },
  {
    color: '#818b98',
    id: 'c-template',
    imageUrl:
      'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/c.svg',
    name: 'C',
    value: LessonTemplate.C,
  },
  {
    color: '#2d0c4a',
    id: 'elixir-template',
    imageUrl: 'https://avatars.githubusercontent.com/u/1481354?s=200&v=4',
    name: 'Elixir',
    value: LessonTemplate.Elixir,
    withBackground: true,
  },
  {
    color: '#d8762c',
    id: 'java-template',
    imageUrl:
      'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/java.svg',
    name: 'Java',
    value: LessonTemplate.Java,
  },
  {
    color: '#456f9d',
    id: 'python-template',
    imageUrl:
      'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/python.svg',
    name: 'Python',
    value: LessonTemplate.Python,
  },
  {
    color: '#b7311c',
    id: 'ruby-template',
    imageUrl:
      'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/ruby.svg',
    name: 'Ruby',
    value: LessonTemplate.Ruby,
  },
  {
    color: '#fff',
    id: 'rust-template',
    imageUrl:
      'https://raw.githubusercontent.com/gilbarbara/logos/master/logos/rust.svg',
    name: 'Rust',
    value: LessonTemplate.Rust,
    withBackground: true,
  },
];

const CreateLesson: React.FC<Props> = () => {
  const router = useRouter();
  const [createLesson] = useCreateLessonMutation();

  return (
    <Formik
      initialValues={{
        codesandboxId: '',
        description: 'description',
        stackblitzId: '',
        template: 'React',
        title: '',
      }}
      onSubmit={async (values, { setErrors }) => {
        try {
          const { data } = await createLesson({
            variables: values,
          });
          if (data?.createLesson.errors) {
            setErrors(toErrorMap(data.createLesson.errors));
          } else if (data?.createLesson.lesson) {
            modalVar({ callback: () => null, name: null });
            router.push(`/lessons/edit/${data.createLesson.lesson.id}`);
          }
        } catch (e: any) {
          if (
            e &&
            e.message &&
            e.message.includes('User is not authenticated.')
          ) {
            setErrors({
              description: 'You must be logged in to create lessons!',
            });
          }
        }
      }}
    >
      {({ isSubmitting, values }) => {
        return (
          <Form>
            <div className="p-6 lg:px-8 mx-auto max-w-2xl">
              <h1 className="flex mb-4 text-xl font-semibold text-text-primary">
                New Lesson
              </h1>
              <div className="flex flex-col gap-4">
                <div className="w-1/2">
                  <InputField
                    label="Title"
                    maxLength={90}
                    name="title"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-text-primary">
                    Select a Template
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {templates.map((template) => {
                      if (
                        template.value === LessonTemplate.Sandpack ||
                        template.value === LessonTemplate.Stackblitz
                      )
                        return null;
                      return (
                        <label
                          className={`w-full flex ${
                            values.template === template.value
                              ? 'shadow-md'
                              : 'shadow-sm'
                          } hover:shadow-md transition-shadow duration-300 items-center bg-bg-nav-faded p-2 rounded-md cursor-pointer`}
                          htmlFor={template.id}
                          key={template.id}
                        >
                          <Field
                            id={template.id}
                            name="template"
                            required
                            type="radio"
                            value={template.value}
                          />{' '}
                          <div className="flex flex-col items-start ml-2">
                            <img
                              className={`mt-1 h-6 ${
                                template.withBackground
                                  ? 'bg-white rounded-full'
                                  : ''
                              }`}
                              src={template.imageUrl}
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="text-text-primary border-b-2 border-bg-nav-offset-faded border-dashed"></div>
                <div>
                  <label className="block text-sm font-medium text-text-primary">
                    Or enter a{' '}
                    <a
                      className="underline"
                      href="https://codesandbox.io"
                      target="_blank"
                    >
                      Codesandbox
                    </a>{' '}
                    slug
                  </label>
                  <InputField
                    label=""
                    maxLength={120}
                    name="codesandboxId"
                    placeholder="loving-kalam-nd0r9"
                    type="text"
                  />
                </div>
                <div className="text-text-primary border-b-2 border-bg-nav-offset-faded border-dashed"></div>
                <div>
                  <label className="block text-sm font-medium text-text-primary">
                    Or enter a{' '}
                    <a
                      className="underline"
                      href="https://stackblitz.com"
                      target="_blank"
                    >
                      Stackblitz
                    </a>{' '}
                    slug
                  </label>
                  <InputField
                    label=""
                    maxLength={120}
                    name="stackblitzId"
                    placeholder="node-sfhvhp"
                    type="text"
                  />
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
