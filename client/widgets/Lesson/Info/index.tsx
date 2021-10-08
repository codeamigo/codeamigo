import { Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { LessonQuery } from '👨‍💻generated/graphql';
import LessonOptions, { Options } from '👨‍💻widgets/Lesson/Info/LessonOptions';
import UserMenu from '👨‍💻widgets/UserMenu';

import Form from './Form';
import View from './View';

export const LessonInfoHeaderHeight = '2.75';

const Info: React.FC<Props> = ({ isEditing, isPreviewing, ...rest }) => {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <div
        className="w-full py-1 px-3 sm:px-4 flex items-center justify-between bg-bg-nav border-b border-bg-nav-offset-faded relative z-30"
        style={{ minHeight: `${LessonInfoHeaderHeight}rem` }}
      >
        <div className="flex items-center overflow-x-hidden overflow-ellipsis">
          <div>
            <Icon
              className="text-text-primary text-lg cursor-pointer text-md mr-2 sm:mr-4"
              name="home"
              onClick={() => router.push('/')}
            />
          </div>
          <div className="md:text-lg font-bold min-w-0 md:absolute md:transform md:-translate-x-1/2 md:left-1/2">
            {isEditing ? <Form {...rest} /> : <View {...rest} />}
          </div>
        </div>
        <div className="flex justify-end items-center pl-2 md:w-1/4">
          <div className="flex items-center">
            {isEditing && rest.lesson ? (
              <LessonOptions
                lessonId={rest.lesson.id}
                setShowOptions={setShowOptions}
                showOptions={showOptions}
              />
            ) : (
              <a
                href="https://github.com/codeamigo/questions/issues"
                target="_blank"
              >
                <Icon className="text-text-primary text-lg" name="lifebuoy" />
              </a>
            )}
          </div>
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
      <Transition show={showOptions}>
        <Options {...rest} />
      </Transition>
    </div>
  );
};

type Props = {
  isEditing?: boolean;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
};

export default Info;
