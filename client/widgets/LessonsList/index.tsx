import { useRouter } from 'next/router';
import React from 'react';

import { LessonsQuery, useLessonsQuery, useMeQuery } from '👨‍💻generated/graphql';
import LessonItem from '👨‍💻widgets/LessonsList/LessonItem';

const LessonsList: React.FC<Props> = () => {
  const { data } = useLessonsQuery({ fetchPolicy: 'cache-and-network' });
  const router = useRouter();

  const queryDeps =
    (router.query.deps as string)?.split('|').filter((x) => !!x) || [];

  // Move filtering to BE
  const showLesson = (lesson: LessonsQuery['lessons'][0]) => {
    return (
      queryDeps.length === 0 ||
      lesson.steps?.some((step) => {
        return step.dependencies?.some((dependency) =>
          queryDeps.includes(dependency.package)
        );
      })
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.lessons.map((lesson) => {
        return showLesson(lesson) ? <LessonItem lesson={lesson} /> : null;
      })}
    </div>
  );
};

type Props = {};

export default LessonsList;
