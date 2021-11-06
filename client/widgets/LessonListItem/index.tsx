import moment from 'moment';
import router from 'next/router';
import React from 'react';

import * as codeamigoPng from '👨‍💻assets/codeamigo_logo.png';
import Icon from '👨‍💻components/Icon';
import { LessonsQuery } from '👨‍💻generated/graphql';
import { templates } from '👨‍💻modals/CreateLesson';
import { formatNumber } from '👨‍💻utils/numberUtils';
import { levelColorMap } from '👨‍💻widgets/HomepageFilters/Levels';
import ProfileLogo from '👨‍💻widgets/ProfileLogo';

const LessonListItem: React.FC<Props> = ({
  href,
  lesson,
  options,
  progress,
}) => {
  const views = Math.max(lesson.students?.length || 0, lesson.views || 0);
  const students = lesson.students?.length || 0;
  const template = templates.find((t) => t.value === lesson.template);

  return (
    <div className="flex overflow-hidden flex-col rounded-lg border-2 hover:shadow-lg transition-shadow duration-200 border-bg-nav-offset">
      <div
        className="border-b-2 cursor-pointer border-bg-nav-offset"
        onClick={() => router.push(href)}
      >
        <div
          className="overflow-hidden h-48 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${lesson.thumbnail || codeamigoPng}` }}
        />
      </div>
      <div
        className="flex relative flex-col flex-1 justify-between p-3 rounded-br-lg rounded-bl-lg bg-bg-nav"
        key={lesson.id}
      >
        <div className="relative">
          <div className="flex absolute -top-14 right-2 justify-center items-center p-2.5 w-14 h-14 rounded-full border-2 bg-bg-nav border-bg-nav-offset">
            {template ? (
              <img
                className={`${
                  template.withBackground ? 'bg-white rounded-full' : ''
                }`}
                src={template.imageUrl}
              />
            ) : (
              <ProfileLogo userId={lesson.owner.id} />
            )}
          </div>
          <div className="flex justify-between items-center">
            <a
              className="font-bold underline hover:underline overflow-ellipsis text-text-primary"
              href={href}
            >
              {lesson.title}
            </a>
            {options ? options : null}
          </div>
          <h3 className="flex items-center mt-0.5 text-xs font-semibold text-text-primary">
            by {lesson.owner.username}
          </h3>
        </div>
        <div>
          {progress ? progress : null}
          {lesson.tags?.length ? (
            <div className="flex gap-1.5 mt-2">
              {lesson.tags?.map(({ name }) => {
                return (
                  <span
                    className="text-xs opacity-90 text-text-primary"
                    key={name}
                  >
                    #{name}
                  </span>
                );
              })}
            </div>
          ) : null}
          <div className="flex mt-2 text-xs font-bold text-text-primary">
            <div
              aria-label={`${lesson.students?.length} Students`}
              className="hint--top-right hint--no-animate"
            >
              <div className="flex">
                <Icon
                  className="mr-1 cursor-auto text-text-primary"
                  name="users"
                />{' '}
                <div className="text-text-primary">
                  {formatNumber(students)}
                </div>
              </div>
            </div>
            <div
              aria-label={`${views} Views`}
              className="ml-3 hint--top-right hint--no-animate"
            >
              <div className="flex">
                <Icon
                  className="mr-1 cursor-auto text-text-primary"
                  name="eye"
                />{' '}
                <div className="text-text-primary">{formatNumber(views)}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 ml-1 text-xs font-bold text-text-primary">
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
