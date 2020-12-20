import React, { useState } from "react";

import { useLessonQuery } from "../../generated/graphql";
import { NextPage } from "next";

import StepForm from "./components/form";
import Steps from "../../widgets/Lesson/Steps";

const EditLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const { data, refetch } = useLessonQuery({ variables: { id } });

  if (!data) return null;
  if (!data.lesson) return null;

  return (
    <div className="flex px-8">
      <Steps
        data={data}
        refetch={refetch}
        currentStepIdx={currentStepIdx}
        setCurrentStepIdx={setCurrentStepIdx}
      />
      <StepForm
        currentStepIdx={currentStepIdx}
        lesson={data.lesson}
        refetch={refetch}
      />
    </div>
  );
};

EditLesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default EditLesson;
