import { Menu, Transition } from '@headlessui/react';
import React, { useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  LessonDocument,
  LessonLabel,
  LessonQuery,
  useUpdateLessonLabelMutation,
} from '👨‍💻generated/graphql';

const Label: React.FC<Props> = ({ lesson }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [updateLabelM] = useUpdateLessonLabelMutation();

  if (!lesson) return null;

  useOnClickOutside(wrapperRef, () => {
    setShowOptions(false);
  });

  const updateLabel = (label: LessonLabel) => {
    const q = {
      query: LessonDocument,
      variables: { id: lesson.id },
    };

    updateLabelM({
      update: (store) => {
        const lessonData = store.readQuery<LessonQuery>(q);
        if (!lessonData?.lesson) return;

        store.writeQuery<LessonQuery>({
          ...q,
          data: {
            lesson: {
              ...lessonData.lesson,
              label,
            },
          },
        });
      },
      variables: { id: lesson.id, label },
    });
  };

  return (
    <div ref={wrapperRef}>
      <div
        className="flex items-center text-sm text-text-primary cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
        role="button"
      >
        Label <Icon className="ml-1 text-text-primary" name="down-dir" />
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
                  className="absolute right-0 py-1 mt-2 w-48 bg-bg-primary rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-left"
                  role="menu"
                >
                  <Button
                    className="justify-between py-1 w-full text-text-primary bg-bg-primary"
                    onClick={() => updateLabel(LessonLabel.Beginner)}
                    role="menuitem"
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-2 w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>Beginner</span>
                    </div>
                    {lesson.label === LessonLabel.Beginner ? (
                      <div>✅</div>
                    ) : null}
                  </Button>
                  <Button
                    className="justify-between py-1 w-full text-text-primary bg-bg-primary"
                    onClick={() => updateLabel(LessonLabel.Intermediate)}
                    role="menuitem"
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-2 w-3 h-3 bg-yellow-300 rounded-full"></div>
                      <span>Intermediate</span>
                    </div>
                    {lesson.label === LessonLabel.Intermediate ? (
                      <div>✅</div>
                    ) : null}
                  </Button>
                  <Button
                    className="justify-between py-1 w-full text-text-primary bg-bg-primary"
                    onClick={() => updateLabel(LessonLabel.Advanced)}
                    role="menuitem"
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-2 w-3 h-3 bg-red-600 rounded-full"></div>
                      <span>Advanced</span>
                    </div>
                    {lesson.label === LessonLabel.Advanced ? (
                      <div>✅</div>
                    ) : null}
                  </Button>
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

export default Label;
