import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import {
  useDeleteLessonMutation,
  useLessonsQuery,
  useMeQuery,
  useUpdateLessonStatusMutation,
} from '👨‍💻generated/graphql';
import LessonListItem from '👨‍💻widgets/LessonListItem';

const EditingLessonsList: React.FC<Props> = () => {
  const { data: meData } = useMeQuery();
  const { data, loading } = useLessonsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { ownerId: meData?.me?.id, status: 'EDITTING' },
  });

  const [deleteLessonM] = useDeleteLessonMutation();
  const [updateLessonStatusM] = useUpdateLessonStatusMutation();
  const router = useRouter();

  const deleteLesson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    const yes = window.confirm('Are you sure you want to delete this lesson?');
    if (yes) {
      await deleteLessonM({
        refetchQueries: ['Lessons'],
        variables: { id },
      });
    }
  };

  const publishLesson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    await updateLessonStatusM({
      refetchQueries: ['Lessons'],
      variables: { id, status: 'PENDING_PUBLISH' },
    });
  };

  if (loading && !data?.lessons)
    return <div className="text-text-primary">Loading...</div>;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold border-b-2 text-text-primary">
        📝 Editing
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.lessons.length ? (
          data?.lessons?.map((lesson) => {
            return (
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
                              aria-labelledby="session-menu"
                              aria-orientation="vertical"
                              className="absolute right-0 py-1 mt-2 w-48 rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right bg-bg-primary"
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
                                    onClick={(e) => publishLesson(e, lesson.id)}
                                    role="menuitem"
                                  >
                                    🚀&nbsp;<span>Publish Lesson</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`w-full inline-block text-left px-4 py-2 text-sm ${
                                      active
                                        ? 'bg-accent text-bg-primary'
                                        : 'text-text-primary'
                                    }`}
                                    onClick={() =>
                                      router.push(`/lessons/edit/${lesson.id}`)
                                    }
                                    role="menuitem"
                                  >
                                    📝&nbsp;<span>Edit Lesson</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`w-full inline-block text-left px-4 py-2 text-sm ${
                                      active
                                        ? 'bg-accent text-bg-primary'
                                        : 'text-text-primary'
                                    }`}
                                    onClick={(e) => deleteLesson(e, lesson.id)}
                                    role="menuitem"
                                  >
                                    🚮&nbsp;<span>Delete Lesson</span>
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
            );
          })
        ) : (
          <div
            className="flex flex-col justify-center items-center w-32 h-32 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() =>
              modalVar({ callback: () => null, name: 'createLesson' })
            }
          >
            <Icon className="text-xl" name="plus-squared" />
            <p className="text-sm font-bold">New Lesson</p>
          </div>
        )}
      </div>
    </div>
  );
};

type Props = {};

export default EditingLessonsList;
