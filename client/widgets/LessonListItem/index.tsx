import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import * as codeamigoPng from '👨‍💻assets/codeamigo_logo.png';
import Icon from '👨‍💻components/Icon';
import { LessonsQuery, useMeQuery } from '👨‍💻generated/graphql';
import LanguageBar from '👨‍💻widgets/LessonsList/LanguageBar';

const LessonListItem: React.FC<Props> = ({ lesson, options, progress }) => {
  const { data: meData } = useMeQuery({ fetchPolicy: 'cache-and-network' });
  const router = useRouter();

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

  return (
    <div className="rounded-lg border-bg-nav-offset border-4">
      <div className="p-2 border-b-4 border-bg-nav-offset">
        <div
          className="h-48 overflow-hidden bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${lesson.thumbnail || codeamigoPng}` }}
        />
      </div>
      <div className="p-3" key={lesson.id}>
        <div className="flex justify-between items-center">
          <a
            className="text-md text-accent font-semibold hover:underline"
            href="/"
            onClick={(e) => handleClick(e, lesson.id)}
          >
            {lesson.title}
          </a>
          {options ? options : null}
        </div>
        <h3 className="text-xs text-text-primary">
          By: {lesson.owner.username}
        </h3>
        {progress ? progress : null}
        {lesson.students?.length ? (
          <div className="flex justify-between mt-4 text-xs text-text-primary">
            <div
              aria-label={`${lesson.students?.length} Students`}
              className="hint--top hint--no-animate"
            >
              <div className="flex">
                <Icon
                  className="text-text-primary mr-1 cursor-auto"
                  name="users"
                />{' '}
                <div className="text-text-primary">
                  {lesson.students?.length}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex justify-between items-center mt-2 text-xs text-text-primary">
          <LanguageBar steps={lesson.steps} />
          <div>{new Date(parseInt(lesson.createdAt)).toDateString()}</div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  lesson: LessonsQuery['lessons'][0];
  options?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  progress?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

export default LessonListItem;
