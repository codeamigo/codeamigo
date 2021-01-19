import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { LessonsQuery, useLessonsQuery, useMeQuery } from '👨‍💻generated/graphql';

const Lessons: React.FC<Props> = () => {
  const { data: meData } = useMeQuery();
  const { data } = useLessonsQuery();
  const router = useRouter();

  const queryDeps =
    (router.query.deps as string)?.split('|').filter((x) => !!x) || [];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: number
  ) => {
    e.preventDefault();
    if (meData?.me?.isAuthenticated) {
      router.push(`/lessons/start/${id}`);
    } else {
      modalVar({
        callback: () => router.push(`/lessons/start/${id}`),
        name: 'login',
      });
    }
  };

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
        return showLesson(lesson) ? (
          <div
            className="p-3 rounded-lg border-gray-200 border"
            key={lesson.id}
          >
            <a
              className="text-md text-blue-600 font-semibold hover:underline"
              href="/"
              onClick={(e) => handleClick(e, lesson.id)}
            >
              {lesson.title}
            </a>
            <h3 className="text-xs">By: {lesson.owner.username}</h3>
            <div className="flex justify-between mt-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid grid-cols-2 gap-0.5">
                  <Icon className="text-gray-500" name="users" />{' '}
                  <div>{lesson.students?.length}</div>
                </div>
                {/* <div className="grid grid-cols-2 gap-0.5">
            <Icon className="text-gray-500" name="heart" />{' '}
            <div>{lesson.likes || 0}</div>
          </div> */}
              </div>
              <div>{new Date(parseInt(lesson.createdAt)).toDateString()}</div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

type Props = {};

export default Lessons;
