import React from 'react';

import { useLessonsQuery, useMeQuery } from '👨‍💻generated/graphql';

import LessonItem from './LessonItem';

const PublishedLessonsList: React.FC<Props> = () => {
  const { data: meData } = useMeQuery();

  if (!meData?.me) return null;

  const { data, loading } = useLessonsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { ownerId: meData.me.id, status: 'PUBLISHED' },
  });

  if (loading && !data?.lessons)
    return <div className="text-text-primary">Loading...</div>;

  return data?.lessons.length ? (
    <div className="mt-8">
      <h2 className="border-b-2 text-xl text-text-primary font-bold mb-4">
        🚀 Published
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.lessons.map((lesson) => {
          return <LessonItem key={lesson.id} lesson={lesson} />;
        })}
      </div>
    </div>
  ) : null;
};

type Props = {};

export default PublishedLessonsList;
