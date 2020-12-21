import React, { useState } from "react";
import { NextPage } from "next";

import { useLessonQuery } from "@generated/graphql";
import Steps from "@widgets/Lesson/Steps";
import StepForm from "@widgets/StepForm";

const EditLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepId, setCurrentStepId] = useState(0);

  const { data, refetch } = useLessonQuery({
    variables: { id },
  });

  if (!data) return null;
  if (!data.lesson) return null;
  if (!data.lesson.steps) return null;

  const stepId = currentStepId || data.lesson.steps[0].id;

  return (
    <div className="flex px-8">
      <Steps
        refetch={refetch}
        steps={data.lesson.steps}
        lessonId={data.lesson.id}
        currentStepId={stepId}
        setCurrentStepId={setCurrentStepId}
      />
      <StepForm lesson={data.lesson} currentStepId={stepId} />
    </div>
  );
};

EditLesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default EditLesson;
