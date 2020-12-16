import React, { useState } from "react";

import { Lesson, useLessonQuery } from "../../generated/graphql";
import { NextPage } from "next";

import Steps from "./components/steps";
import StepForm from "./components/form";

const EditLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const { loading, error, data, refetch } = useLessonQuery({ variables: { id } });

  console.log(error)

  if (!data) return null;
  if (!data.lesson) return null;

  return (
    <div className="flex px-8">
      <Steps data={data} handleClick={(n: number) => setCurrentStepIdx(n)} />
      <StepForm
        stepIdx={currentStepIdx}
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
