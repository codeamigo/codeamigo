import { useRouter } from 'next/router';
import React from 'react';

import { useLessonsQuery } from '👨‍💻generated/graphql';
import LessonListItem from '👨‍💻widgets/LessonListItem';

const LessonsList: React.FC<Props> = () => {
  const router = useRouter();

  const querySortBy = router.query.sortBy || 'views-desc';
  const queryTemplate = router.query.template as string;
  const queryLevels =
    (router.query.levels as string)?.split('|').filter((x) => !!x) || [];

  console.log(querySortBy);
  const { data } = useLessonsQuery({
    fetchPolicy: 'cache-first',
    variables: {
      labels: queryLevels.join('|'),
      sortBy: querySortBy as string,
      status: 'PUBLISHED',
      template: queryTemplate,
    },
  });

  console.log(data?.lessons);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
