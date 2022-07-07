import moment from 'moment';
import router from 'next/router';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import {
  LessonsQuery,
  LessonTemplate,
  useSessionQuery,
} from '👨‍💻generated/graphql';
import { templates } from '👨‍💻modals/CreateLesson';
import { formatNumber } from '👨‍💻utils/numberUtils';
import { levelColorMap } from '👨‍💻widgets/HomepageFilters/Levels';
import ProfileLogo from '👨‍💻widgets/ProfileLogo';

const LessonListItem: React.FC<Props> = ({ href, lesson, options }) => {
  const { data } = useSessionQuery({
    fetchPolicy: 'cache-and-network',
    variables: { lessonId: lesson.id },
  });

  const { session } = data || {};

  const steps = session?.steps || [];
  const length = steps?.length || 1;
  const completed = steps?.filter(({ isCompleted }) => !!isCompleted) || [];
  const percentComplete = Math.floor((completed.length / length) * 100);

  const views = Math.max(lesson.students?.length || 0, lesson.views || 0);
  const students = lesson.students?.length || 0;
  const template = [
    ...templates,
    {
      color: '#fff',
      id: 'sandpack',
      imageUrl: `http://res.cloudinary.com/dqki6kci3/image/upload/v1657147466/oyxsnwyn6h7kexiybt4l.ico`,
      name: 'Sandpack',
      value: LessonTemplate.Sandpack,
    },
  ].find((t) => t.value === lesson.template);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const dasharrayLength = ((100 - percentComplete) / 100) * circumference;

  return (
    <div
      className="flex flex-col rounded-lg border-2 hover:shadow-2xl transition-shadow duration-200 cursor-pointer bg-bg-nav border-bg-nav-offset"
      key={lesson.id}
      onClick={() => router.push(href)}
    >
      <div className="flex relative flex-col flex-1 justify-between p-3">
        <div className="flex gap-3 items-center">
          <div className="flex relative justify-center items-center p-2 w-14 h-14 rounded-full border-2 bg-bg-nav border-bg-nav-offset">
            <svg
              className="absolute top-0 left-0"
              height="100%"
              id="circle-svg"
              version="1.1"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50%"
                cy="50%"
                fill="transparent"
                r={24}
                style={{
                  stroke: 'var(--color-bg-nav)',
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference,
                  strokeWidth: '2px',
                }}
              ></circle>
              <circle
                cx="50%"
                cy="50%"
                fill="transparent"
                id="bar"
                r={24}
                style={{
                  stroke: template?.color,
                  strokeDasharray: circumference,
                  strokeDashoffset: dasharrayLength,
                  strokeLinecap: 'round',
                  strokeWidth: '2px',
                }}
              ></circle>
            </svg>
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
          <div className="relative flex-1">
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
        </div>
        <div>
          {lesson.tags?.length ? (
            <div className="flex gap-1.5 mt-2">
              {lesson.tags?.map(({ name }) => {
                return (
                  <div className="flex py-1 px-2 rounded-md bg-bg-nav-offset">
                    <span className="text-xs text-white" key={name}>
                      #{name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="flex mt-4 text-xs font-bold text-text-primary">
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
};

export default LessonListItem;
