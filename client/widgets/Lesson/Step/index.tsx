import { LessonQuery, useStepQuery } from '@generated/graphql';
import Editor from '@widgets/Lesson/Editor';
import Instructions from '@widgets/Lesson/Instructions';
import React from 'react';

const Step: React.FC<Props> = ({ currentStepId: id, ...rest }) => {
  const { data } = useStepQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id },
  });

  if (!data?.step) return null;

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:h-full-minus">
        <div className="flex w-full lg:h-full lg:overflow-scroll lg:w-1/4">
          {rest.isEditting}
          <Instructions step={data.step} {...rest} />
        </div>
        <div className="flex w-full lg:h-full lg:overflow-scroll lg:w-2/4">
          <Editor step={data.step} {...rest} />
        </div>
        <div className="flex w-full lg:h-full lg:overflow-scroll lg:w-1/4">
          <iframe id="frame" src="http://localhost:1234/"></iframe>
        </div>
      </div>
    </>
  );
};

type Props = {
  currentStepId: number;
  isEditting?: boolean;
  lesson: LessonQuery['lesson'];
  toggleShowSteps: () => void;
};

export default Step;
