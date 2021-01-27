import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { useUserLessonsQuery } from '👨‍💻generated/graphql';

import LessonItem from './LessonItem';

const UserLessonsList: React.FC<Props> = () => {
  const { data, loading } = useUserLessonsQuery({
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.userLessons.length ? (
        data?.userLessons?.map((lesson) => {
          return <LessonItem key={lesson.id} lesson={lesson} />;
        })
      ) : (
        <div
          className="flex flex-col justify-center items-center h-36 w-36 bg-gray-100 text-gray-600 rounded-md cursor-pointer hover:text-blue-600 transform hover:scale-105 transition-colors transition-transform duration-300"
          onClick={() =>
            modalVar({ callback: () => null, name: 'createLesson' })
          }
        >
          <Icon className="text-xl" name="plus-squared" />
          <p className="text-sm font-bold">New Lesson</p>
        </div>
      )}
    </div>
  );
};

type Props = {};

export default UserLessonsList;
