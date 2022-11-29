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

  const { data, loading } = useLessonsQuery({
    fetchPolicy: 'cache-first',
    variables: {
      labels: queryLevels.join('|'),
      sortBy: querySortBy as string,
      status: 'PUBLISHED',
      template: queryTemplate,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {loading
        ? Array.from({ length: 12 }, (_, i) => (
            <div
              className="flex flex-col bg-bg-nav rounded-lg border-2 border-bg-nav-offset hover:shadow-2xl transition-shadow duration-200 animate-pulse cursor-pointer"
              key={i}
            >
              <div className="flex relative flex-col flex-1 justify-between p-3">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 bg-gray-200 rounded-full opacity-50"></div>
                </div>
                <div className="flex gap-1.5">
                  <div className="mt-2 w-5 h-2 bg-gray-200 rounded-md opacity-50"></div>
                  <div className="mt-2 w-5 h-2 bg-gray-200 rounded-md opacity-50"></div>
                  <div className="mt-2 w-5 h-2 bg-gray-200 rounded-md opacity-50"></div>
                </div>
                <div className="mt-2 w-20 h-4 bg-gray-200 rounded-md opacity-50"></div>
                <div className="mt-2 w-36 h-4 bg-gray-200 rounded-md opacity-50"></div>
              </div>
            </div>
          ))
        : data?.lessons.map((lesson) => {
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
