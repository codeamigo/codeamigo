import { Menu, Transition } from '@headlessui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';

import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import Icon from '👨‍💻components/Icon';
import Pill from '👨‍💻components/Pill';
import {
  LessonDocument,
  LessonQuery,
  useAddLessonTagMutation,
} from '👨‍💻generated/graphql';

const Tags: React.FC<Props> = ({ lesson }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [addTagM] = useAddLessonTagMutation();

  if (!lesson) return null;

  useOnClickOutside(wrapperRef, () => {
    setShowOptions(false);
  });

  const addTag = (tag: string) => {
    const q = {
      query: LessonDocument,
      variables: { id: lesson.id },
    };

    return addTagM({
      update: (store) => {
        const lessonData = store.readQuery<LessonQuery>(q);
        if (!lessonData?.lesson) return;

        store.writeQuery<LessonQuery>({
          ...q,
          data: {
            lesson: {
              ...lessonData.lesson,
              tags: [...(lessonData.lesson.tags || []), { name: tag }],
            },
          },
        });
      },

      variables: { id: lesson.id, name: tag },
    });
  };

  return (
    <div ref={wrapperRef}>
      <div
        className="flex items-center text-sm cursor-pointer text-text-primary"
        onClick={() => setShowOptions(!showOptions)}
        role="button"
      >
        Tags <Icon className="ml-1 text-text-primary" name="down-dir" />
      </div>
      <div className="relative z-10">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                aria-haspopup="true"
                className={`flex text-sm outline-none focus:outline-none`}
              >
                <span className="sr-only">Open lesson menu</span>
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={showOptions}
              >
                <div
                  aria-labelledby="session-menu"
                  aria-orientation="vertical"
                  className="absolute right-0 py-1 mt-2 w-48 rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-left bg-bg-primary"
                  role="menu"
                >
                  <Formik
                    initialValues={{ name: '' }}
                    onSubmit={(values, { setErrors }) => {
                      if (lesson.tags?.find((t) => t.name === values.name)) {
                        setErrors({ name: 'Tag already exists' });
                        return true;
                      }

                      return addTag(values.name);
                    }}
                  >
                    {({ isSubmitting, isValid, values }) => (
                      <Form className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {lesson.tags?.map((tag) => (
                            <Pill key={tag.name}>{tag.name}</Pill>
                          ))}
                        </div>
                        <InputField
                          className="mt-3"
                          label="Name"
                          name="name"
                          placeholder="Enter a new tag"
                          required
                          type="text"
                        />
                        <div className="flex justify-end">
                          <Button
                            className="mt-2"
                            disabled={isSubmitting}
                            type="submit"
                          >
                            Submit
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
};

export default Tags;
