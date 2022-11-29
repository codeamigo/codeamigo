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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <Menu.Items
                        aria-labelledby="user-menu"
                        aria-orientation="vertical"
                        className="absolute right-0 py-1 mt-2 w-48 bg-bg-primary rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right"
                        role="menu"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`w-full inline-block text-left px-4 py-2 text-sm ${
                                active
                                  ? 'bg-accent text-bg-primary'
                                  : 'text-text-primary'
                              }`}
                              onClick={(e) => approveLesson(e, lesson.id)}
                              role="menuitem"
                            >
                              <span className="mr-2">✅</span>
                              <span>Approve Lesson</span>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
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
