import React from "react";
import { LessonQuery, useCreateStepMutation } from "../../../generated/graphql";

const Steps: React.FC<Props> = ({ data, handleClick }) => {
  const [createStepM] = useCreateStepMutation();

  const createStep = async () => {
    const step = await createStepM({
      variables: { lessonId: data.lesson!.id },
    });
  };

  return (
    <div className="w-1/12 py-5 bg-white">
      <ol>
        {data.lesson?.steps &&
          data.lesson.steps.map((step, i) => {
            return (
              <li
                className="list-none"
                key={step.id}
                onClick={() => handleClick(i)}
              >
                Step: {i + 1}
              </li>
            );
          })}
      </ol>
      <button
        className="inline-flex justify-center py-2 px-4 mt-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 whitespace-nowrap"
        type="button"
        onClick={createStep}
      >
        Add Step
      </button>
    </div>
  );
};

type Props = {
  data: LessonQuery;
  handleClick: (n: number) => void;
};

export default Steps;
