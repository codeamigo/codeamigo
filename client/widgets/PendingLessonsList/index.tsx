import { Menu, Transition } from '@headlessui/react';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import {
  useLessonsQuery,
  useUpdateLessonStatusMutation,
} from '👨‍💻generated/graphql';
import LessonListItem from '👨‍💻widgets/LessonListItem';

const PendingLessonsList: React.FC<Props> = () => {
  const { data } = useLessonsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { status: 'PENDING_PUBLISH' },
  });
  const [updateLessonStatusM] = useUpdateLessonStatusMutation();

  const approveLesson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    await updateLessonStatusM({
      refetchQueries: ['Lessons'],
      variables: { id, status: 'PUBLISHED' },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.lessons.map((lesson) => (
        <LessonListItem
          href={`/lessons/edit/${lesson.id}`}
          key={lesson.id}
          lesson={lesson}
          options={
            <div className="relative z-10">
              <Menu>
                {({ open }) => (
                  <>
                    <Menu.Button
                      aria-haspopup="true"
                      className={`flex text-sm outline-none focus:outline-none`}
                    >
                      <span className="sr-only">Open lesson menu</span>
                      <Icon className="text-gray-400" name="dot-3" />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      show={open}
                    >
                      <div
                        aria-labelledby="session-menu"
                        aria-orientation="vertical"
                        className="origin-top-right bg-bg-primary absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                        role="menu"
                      >
                        <button
                          className="w-full inline-block text-left px-4 py-2 text-sm text-text-primary hover:bg-accent hover:text-bg-primary"
                          onClick={(e) => approveLesson(e, lesson.id)}
                          role="menuitem"
                        >
                          <span className="mr-2">✅</span>
                          <span>Approve Lesson</span>
                        </button>
                      </div>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          }
        />
      ))}
    </div>
  );
};

type Props = {};

export default PendingLessonsList;
