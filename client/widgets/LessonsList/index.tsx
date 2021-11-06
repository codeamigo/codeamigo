import { useRouter } from 'next/router';
import React from 'react';

import { useLessonsQuery } from '👨‍💻generated/graphql';
import LessonListItem from '👨‍💻widgets/LessonListItem';

const LessonsList: React.FC<Props> = () => {
  const router = useRouter();

  const queryTemplate = router.query.template as string;
  const queryDeps =
    (router.query.deps as string)?.split('|').filter((x) => !!x) || [];
  const queryLevels =
    (router.query.levels as string)?.split('|').filter((x) => !!x) || [];

  const { data } = useLessonsQuery({
    fetchPolicy: 'cache-first',
    variables: {
      dependencies: queryDeps.join('|'),
      labels: queryLevels.join('|'),
      status: 'PUBLISHED',
      template: queryTemplate,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.lessons.map((lesson) => {
        return (
          <LessonListItem
            href={`/lessons/start/${lesson.id}`}
            key={lesson.id}
            lesson={lesson}
          />
        );
      })}
    </div>
  );
};

type Props = {};

export default LessonsList;
