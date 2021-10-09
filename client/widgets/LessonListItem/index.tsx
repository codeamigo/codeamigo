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
    <div className="flex flex-col rounded-lg border-2 border-bg-nav-offset">
      <div
        className="p-2 border-b-2 cursor-pointer border-bg-nav-offset"
        onClick={() => router.push(href)}
      >
        <div
          className="overflow-hidden h-48 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${lesson.thumbnail || codeamigoPng}` }}
        />
      </div>
      <div
        className="flex flex-col flex-1 justify-between p-3 rounded-br-lg rounded-bl-lg bg-bg-nav"
        key={lesson.id}
      >
        <div>
          <div className="flex justify-between items-center">
            <a
              className="font-bold underline hover:underline overflow-ellipsis text-text-primary"
              href={href}
            >
              {lesson.title}
            </a>
            {options ? options : null}
          </div>
          <h3 className="flex items-center text-xs font-semibold text-text-primary">
            <div className="p-1 mr-1 w-8 h-8 rounded-full border bg-bg-nav border-bg-nav-offset">
              <ProfileLogo userId={lesson.owner.id} />
            </div>{' '}
            {lesson.owner.username}
          </h3>
        </div>
        <div>
          {progress ? progress : null}
          <div className="flex justify-between mt-4 text-xs font-bold text-text-primary">
            <div
              aria-label={`${lesson.students?.length} Students`}
              className="hint--top hint--no-animate"
            >
              <div className="flex">
                <Icon
                  className="mr-1 cursor-auto text-text-primary"
                  name="users"
                />{' '}
                <div className="text-text-primary">
                  {lesson.students?.length || 0}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs font-bold text-text-primary">
            <div className="flex items-center capitalize text-text-primary">
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
