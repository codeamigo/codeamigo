import { Menu, Transition } from '@headlessui/react';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import { LessonsQuery, useDeleteLessonMutation } from '👨‍💻generated/graphql';
import LanguageBar from '👨‍💻widgets/LessonsList/LanguageBar';

const LessonItem: React.FC<Props> = ({ lesson }) => {
  const [deleteLessonM] = useDeleteLessonMutation();

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

  return (
    <div
      className="p-3 rounded-lg border-bg-nav-offset border-2"
      key={lesson.id}
    >
      <div className="flex justify-between items-start">
        <a
          className="text-md text-accent font-semibold hover:underline"
          href={`/lessons/start/${lesson.id}`}
        >
          {lesson.title}
        </a>
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
                      className="w-full flex items-center text-left px-3 py-2 text-sm text-text-primary hover:bg-accent"
                      onClick={(e) => deleteLesson(e, lesson.id)}
                      role="menuitem"
                    >
                      <Icon className="text-red-500 mr-2" name="trash" />{' '}
                      <span>Delete Lesson</span>
                    </button>
                  </div>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
      <h3 className="text-xs text-text-primary">By: {lesson.owner.username}</h3>
      <div className="flex justify-between mt-4 text-xs">
        <div
          aria-label={`${lesson.students?.length} Students`}
          className="hint--top hint--no-animate"
        >
          <div className="flex">
            <Icon className="text-text-primary mr-1 cursor-auto" name="users" />{' '}
            <div className="text-text-primary">{lesson.students?.length}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-xs text-text-primary">
        <LanguageBar steps={lesson.steps} />
        <div>{new Date(parseInt(lesson.createdAt)).toDateString()}</div>
      </div>
    </div>
  );
};

type Props = {
  lesson: LessonsQuery['lessons'][0];
};

export default LessonItem;
