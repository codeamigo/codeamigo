import React from 'react';

import { useUserLessonsQuery } from '👨‍💻generated/graphql';

import LessonItem from './LessonItem';

const UserLessonsList: React.FC<Props> = () => {
  const { data } = useUserLessonsQuery({ fetchPolicy: 'cache-and-network' });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.userLessons?.map((lesson) => {
        return <LessonItem key={lesson.id} lesson={lesson} />;
      })}
    </div>
  );
};

type Props = {};

export default UserLessonsList;
