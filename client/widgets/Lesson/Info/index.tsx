import { useRouter } from 'next/router';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import { LessonQuery } from '👨‍💻generated/graphql';
import LessonOptions from '👨‍💻widgets/Lesson/Info/LessonOptions';
import StatusIndicator from '👨‍💻widgets/Lesson/Info/StatusIndicator';
import UserMenu from '👨‍💻widgets/UserMenu';

import Form from './Form';
import View from './View';

export const LessonInfoHeaderHeight = '2.75';

const Info: React.FC<Props> = ({ isEditting, ...rest }) => {
  const router = useRouter();

  return (
    <div
      className="w-full py-1 px-4 flex items-center bg-bg-nav border-b border-bg-nav-offset relative"
      style={{ minHeight: `${LessonInfoHeaderHeight}rem` }}
    >
      <div className="w-1/4 flex items-center">
        <Icon
          className="text-text-primary text-lg cursor-pointer text-md mr-4"
          name="home"
          onClick={() => router.push('/')}
        />
        <StatusIndicator />
      </div>
      <div className="w-1/2">
        {isEditting ? <Form {...rest} /> : <View {...rest} />}
      </div>
      <div className="w-1/4 flex justify-end items-center">
        <div className="flex items-center">
          {isEditting ? <LessonOptions /> : null}
        </div>
        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

type Props = {
  isEditting?: boolean;
  lesson: LessonQuery['lesson'];
};

export default Info;
