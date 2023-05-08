import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import {
  CheckpointsQuery,
  Step,
  UserLessonPositionQuery,
} from '👨‍💻generated/graphql';

const ProgressBar: React.FC<Props> = ({
  checkpoints,
  lessonSlug,
  step,
  steps,
  title,
  userLessonPosition,
}) => {
  const router = useRouter();

  if (!steps) return null;
  if (steps?.length === 0) return null;

  return (
    <div
      className="flex cursor-pointer items-center gap-2 text-xs font-light"
      onClick={() => {
        modalVar({
          callback: (slug: string) => {
            router.push(`/v2/lesson/${lessonSlug}/step/${slug}`);
          },
          data: { checkpoints, steps, title, userLessonPosition },
          name: 'steps',
          persistent: false,
        });
      }}
    >
      <div className="h-2 w-32 rounded-full bg-green-900 p-[2px]">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{
            width: `${(((step?.position || 0) + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
      <div className="hidden text-xs text-white sm:block">
        <pre>
          Step {`${(step?.position || 0) + 1}/${steps.length} ${step?.title}`}
        </pre>
      </div>
    </div>
  );
};

type Props = {
  checkpoints?: CheckpointsQuery['checkpoints'];
  lessonSlug: string;
  step: Step;
  steps?: Pick<Step, 'slug' | 'title'>[];
  title: string;
  userLessonPosition?: UserLessonPositionQuery['userLessonPosition'];
};

export default ProgressBar;
