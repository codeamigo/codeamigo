import React from 'react';

import * as codeamigoPng from '👨‍💻assets/codeamigo_logo.png';
import Icon from '👨‍💻components/Icon';
import { LessonsQuery } from '👨‍💻generated/graphql';
import LanguageBar from '👨‍💻widgets/LanguageBar';
import ProfileLogo from '👨‍💻widgets/ProfileLogo';

const LessonListItem: React.FC<Props> = ({
  href,
  lesson,
  options,
  progress,
}) => {
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
            href={href}
          >
            {lesson.title}
          </a>
          {options ? options : null}
        </div>
        <h3 className="text-xs text-text-primary flex items-center">
          <div className="h-8 w-8 p-1 mr-1 bg-bg-nav border border-bg-nav-offset rounded-full">
            <ProfileLogo userId={lesson.owner.id} />
          </div>{' '}
          {lesson.owner.username}
        </h3>
        {progress ? progress : null}
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
                {lesson.students?.length || 0}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-text-primary">
          <LanguageBar steps={lesson.steps} />
          <div>{new Date(parseInt(lesson.createdAt)).toDateString()}</div>
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
