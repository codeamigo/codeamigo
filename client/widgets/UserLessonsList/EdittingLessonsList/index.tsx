import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { useLessonsQuery, useMeQuery } from '👨‍💻generated/graphql';

import LessonItem from './LessonItem';

const EdittingLessonsList: React.FC<Props> = () => {
  const { data: meData } = useMeQuery();

  if (!meData?.me) return null;

  const { data, loading } = useLessonsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { ownerId: meData.me.id, status: 'EDITTING' },
  });

  if (loading && !data?.lessons)
    return <div className="text-text-primary">Loading...</div>;

  return (
    <div>
      <h2 className="border-b-2 text-xl text-text-primary font-bold mb-4">
        📝 Editting
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data?.lessons.length ? (
          data?.lessons?.map((lesson) => {
            return <LessonItem key={lesson.id} lesson={lesson} />;
          })
        ) : (
          <div
            className="flex flex-col justify-center items-center h-32 w-32 bg-gray-100 text-gray-600 rounded-md cursor-pointer hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
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

export default EdittingLessonsList;
