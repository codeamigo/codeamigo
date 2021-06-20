import { useRouter } from 'next/router';
import React from 'react';

import { LessonsQuery, useLessonsQuery } from '👨‍💻generated/graphql';
import LessonListItem from '👨‍💻widgets/LessonListItem';

const LessonsList: React.FC<Props> = () => {
  const { data } = useLessonsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { status: 'PUBLISHED' },
  });
  const router = useRouter();

  const queryDeps =
    (router.query.deps as string)?.split('|').filter((x) => !!x) || [];

  const queryLevels =
    (router.query.levels as string)?.split('|').filter((x) => !!x) || [];

  // Move filtering to BE
  const showLesson = (lesson: LessonsQuery['lessons'][0]) => {
    if (queryLevels.length === 0 && queryDeps.length === 0) return true;

    return (
      queryLevels.includes(lesson.label || '') ||
      lesson.steps?.some((step) => {
        return step.codeModules?.some((codeModule) => {
          if (codeModule.name === '/package.json') {
            const value = JSON.parse(codeModule.value!);
            return Object.keys(value.dependencies).some((value) =>
              queryDeps.includes(value)
            );
          }
        });
      })
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.lessons.map((lesson) => {
        return showLesson(lesson) ? (
          <LessonListItem
            href={`/lessons/start/${lesson.id}`}
            key={lesson.id}
            lesson={lesson}
          />
        ) : null;
      })}
    </div>
  );
};

type Props = {};

export default LessonsList;
