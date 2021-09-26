import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import {
  useDeleteLessonMutation,
  useLessonsQuery,
  useMeQuery,
  useUpdateLessonStatusMutation,
} from '👨‍💻generated/graphql';
import LessonListItem from '👨‍💻widgets/LessonListItem';

const PendingApprovalLessonsList: React.FC<Props> = () => {
  const { data: meData } = useMeQuery();
  const [deleteLessonM] = useDeleteLessonMutation();
  const [updateLessonStatusM] = useUpdateLessonStatusMutation();
  const router = useRouter();

  if (!meData?.me) return null;

  const { data, loading } = useLessonsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { ownerId: meData.me.id, status: 'PENDING_PUBLISH' },
  });

  if (loading && !data?.lessons) return null;

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

  const unpublishLesson = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/lessons/edit/${id}`);
    await updateLessonStatusM({
      refetchQueries: ['Lessons'],
      variables: { id, status: 'EDITTING' },
    });
  };

  return data?.lessons.length ? (
    <div className="mt-8">
      <h2 className="border-b-2 text-xl text-text-primary font-bold mb-4">
        ⏳ Pending Approval
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.lessons.map((lesson) => {
          return (
            <LessonListItem
              href={`/lessons/start/${lesson.id}`}
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
                            className="origin-top-right bg-bg-primary absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
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
                                  onClick={(e) => unpublishLesson(e, lesson.id)}
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
        })}
      </div>
    </div>
  ) : null;
};

type Props = {};

export default PendingApprovalLessonsList;
