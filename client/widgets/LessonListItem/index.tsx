import moment from 'moment';
import router from 'next/router';
import React from 'react';

import * as codeamigoPng from '👨‍💻assets/codeamigo_logo.png';
import Icon from '👨‍💻components/Icon';
import { LessonsQuery } from '👨‍💻generated/graphql';
import { levelColorMap } from '👨‍💻widgets/HomepageFilters/Levels';
import ProfileLogo from '👨‍💻widgets/ProfileLogo';

const LessonListItem: React.FC<Props> = ({
  href,
  lesson,
  options,
  progress,
}) => {
  return (
    <div className="flex flex-col rounded-lg border-bg-nav-offset border-2">
      <div
        className="p-2 border-b-2 border-bg-nav-offset cursor-pointer"
        onClick={() => router.push(href)}
      >
        <div
          className="h-48 overflow-hidden bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${lesson.thumbnail || codeamigoPng}` }}
        />
      </div>
      <div
        className="p-3 bg-bg-nav rounded-br-lg rounded-bl-lg flex flex-1 flex-col justify-between"
        key={lesson.id}
      >
        <div>
          <div className="flex justify-between items-center">
            <a
              className="text-md text-text-primary underline font-bold overflow-ellipsis hover:underline"
              href={href}
            >
              {lesson.title}
            </a>
            {options ? options : null}
          </div>
          <h3 className="text-xs text-text-primary font-semibold flex items-center">
            <div className="h-8 w-8 p-1 mr-1 bg-bg-nav border border-bg-nav-offset rounded-full">
              <ProfileLogo userId={lesson.owner.id} />
            </div>{' '}
            {lesson.owner.username}
          </h3>
        </div>
        {progress ? progress : null}
        <div className="flex justify-between mt-4 text-xs font-bold text-text-primary">
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
                {lesson.students?.length || 0}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs font-bold text-text-primary">
          <div className="flex capitalize items-center text-text-primary">
            <div
              className={`w-2 h-2 mr-1 rounded-full ${
                // @ts-ignore
                levelColorMap[lesson.label]
              }`}
            ></div>
            {lesson.label?.toLowerCase()}{' '}
          </div>
          <div>{moment(new Date(parseInt(lesson.createdAt))).fromNow()}</div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  href: string;
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
