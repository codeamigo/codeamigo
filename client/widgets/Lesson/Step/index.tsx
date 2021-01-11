import React from 'react';

import { currentCheckpointVar } from '👨‍💻apollo/cache/step';
import { LessonQuery, SessionQuery, useStepQuery } from '👨‍💻generated/graphql';
import Console from '👨‍💻widgets/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import Instructions from '👨‍💻widgets/Lesson/Instructions';

const Step: React.FC<Props> = ({ currentStepId: id, ...rest }) => {
  const { data } = useStepQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id },
  });

  if (!data?.step) return null;

  console.log(data.step.currentCheckpoint);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:h-full-minus">
        <div className="flex w-full lg:h-full lg:overflow-scroll lg:w-1/4">
          <Instructions step={data.step} {...rest} />
        </div>
        <div className="flex w-full lg:h-full lg:overflow-scroll lg:w-2/4">
          <Editor step={data.step} {...rest} />
        </div>
        <div className="flex flex-col justify-between w-full lg:h-full lg:w-1/4">
          <iframe
            className="w-full h-full"
            id="frame"
            src={process.env.NEXT_PUBLIC_PREVIEW_URL}
          ></iframe>
          <Console />
        </div>
      </div>
    </>
  );
};

type Props = {
  currentStepId: number;
  isEditting?: boolean;
  lesson: LessonQuery['lesson'];
  session?: SessionQuery['session'];
  setCurrentStepId?: (n: number) => void;
  toggleShowSteps: () => void;
};

export default Step;
