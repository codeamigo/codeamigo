import { LessonQuery, useStepQuery } from '@generated/graphql';
import Editor from '@widgets/Lesson/Editor';
import Instructions from '@widgets/Lesson/Instructions';
import React from 'react';

const StepForm: React.FC<Props> = ({ currentStepId: id }) => {
  const { data } = useStepQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id },
  });

  if (!data?.step) return null;

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:h-full">
        <div className="flex w-full lg:w-1/4 lg:h-full">
          <Instructions step={data.step} />
        </div>
        <div className="flex w-full lg:w-2/4">
          <Editor step={data.step} />
        </div>
        <div className="flex w-full lg:w-1/4">
          <iframe id="frame" src="http://localhost:1234/"></iframe>
        </div>
      </div>
    </>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
  currentStepId: number;
  toggleShowSteps: () => void;
};

export default StepForm;
