import React from "react";

import { LessonQuery, useStepQuery } from "@generated/graphql";

import Editor from "@widgets/Lesson/Editor";
import Checkpoints from "@widgets/Lesson/Checkpoints";
import InfoForm from "@widgets/Lesson/InfoForm";
import Instructions from "@widgets/Lesson/Instructions";

const StepForm: React.FC<Props> = ({ currentStepId: id, lesson }) => {
  const { data } = useStepQuery({
    variables: { id },
  });

  if (!data?.step) return null;

  return (
    <form className="w-10/12 w-full">
      <>
        <InfoForm lesson={lesson} />
        <div className="flex w-full">
          <Instructions step={data.step} />
        </div>
        <div className="flex flex-col w-full">
          <Editor step={data.step} />
        </div>
        <div className="flex flex-col w-full">
          <Checkpoints step={data.step} />
        </div>
      </>
    </form>
  );
};

type Props = {
  lesson: LessonQuery["lesson"];
  currentStepId: number;
};

export default StepForm;
