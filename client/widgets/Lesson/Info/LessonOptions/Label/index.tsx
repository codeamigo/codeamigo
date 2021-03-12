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
        className="flex items-center text-text-primary text-sm cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
        role="button"
      >
        Label <Icon className="text-text-primary ml-1" name="down-dir" />
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
                  className="origin-top-left bg-bg-primary absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                  role="menu"
                >
                  <Button
                    className="w-full flex-between py-1 bg-bg-primary text-text-primary"
                    onClick={() => updateLabel(LessonLabel.Beginner)}
                    role="menuitem"
                  >
                    <div className="w-full flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-full bg-green-600"></div>
                      <span>Beginner</span>
                    </div>
                    {lesson.label === LessonLabel.Beginner ? (
                      <div>✅</div>
                    ) : null}
                  </Button>
                  <Button
                    className="w-full flex-between py-1 bg-bg-primary text-text-primary"
                    onClick={() => updateLabel(LessonLabel.Intermediate)}
                    role="menuitem"
                  >
                    <div className="w-full flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-full bg-yellow-300"></div>
                      <span>Intermediate</span>
                    </div>
                    {lesson.label === LessonLabel.Intermediate ? (
                      <div>✅</div>
                    ) : null}
                  </Button>
                  <Button
                    className="w-full flex-between py-1 bg-bg-primary text-text-primary"
                    onClick={() => updateLabel(LessonLabel.Advanced)}
                    role="menuitem"
                  >
                    <div className="w-full flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-full bg-red-600"></div>
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
