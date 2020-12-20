import React, { useEffect, useState } from "react";

import { LessonQuery, useStepQuery } from "../../../../generated/graphql";
import Checkpoints from "./checkpoints";

import Editor from "../../../../widgets/Editor";
import InfoForm from "../../../../widgets/Lesson/InfoForm";
import Instructions from "../../../../widgets/Lesson/Instructions";

const StepForm: React.FC<Props> = ({ currentStepIdx, lesson }) => {
  const steps = lesson!.steps || [];
  const sortedSteps = steps
    .slice()
    .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1));

  const [step, setStep] = useState(sortedSteps[currentStepIdx]);

  const { data } = useStepQuery({ variables: { id: step.id } });

  useEffect(() => {
    setStep(sortedSteps[currentStepIdx]);
  }, [currentStepIdx]);

  if (!data) return null

  return (
    <form className="w-10/12 w-full">
      <>
        <InfoForm lesson={lesson} />
        <div className="flex w-full">
          <Instructions step={step} />
        </div>
        <div className="flex flex-col w-full">
          <Editor step={step} />
        </div>
        <div className="flex flex-col w-full">
          <Checkpoints step={step} />
        </div>
      </>
    </form>
  );
};

type Props = {
  lesson: LessonQuery["lesson"];
  currentStepIdx: number;
};

export default StepForm;
