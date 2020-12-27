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
    <form className="w-full h-screen">
      <InfoForm lesson={lesson} />
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
    </form>
  );
};

type Props = {
  lesson: LessonQuery["lesson"];
  currentStepId: number;
};

export default StepForm;
