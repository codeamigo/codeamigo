import { useRouter } from 'next/router';
import React from 'react';

import { LessonsQuery, useLessonsQuery } from '👨‍💻generated/graphql';

import LessonItem from './LessonItem';

const PendingLessonsList: React.FC<Props> = () => {
  const { data } = useLessonsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { status: 'PENDING_PUBLISH' },
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.lessons.map((lesson) => (
        <LessonItem key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};

type Props = {};

export default PendingLessonsList;
