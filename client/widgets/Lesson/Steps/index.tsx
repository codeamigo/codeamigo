import React from "react";
import Icon from "../../../components/Icon";
import {
  LessonQuery,
  useCreateStepMutation,
  useDeleteStepMutation,
} from "../../../generated/graphql";

import styles from "./Steps.module.scss";

const Steps: React.FC<Props> = ({
  data,
  refetch,
  currentStepIdx,
  setCurrentStepIdx,
}) => {
  const [createStepM] = useCreateStepMutation();
  const [deleteStepM] = useDeleteStepMutation();

  const createStep = async () => {
    await createStepM({
      variables: { lessonId: data.lesson!.id },
    });

    await refetch();

    setCurrentStepIdx(data.lesson?.steps?.length || 0);
  };

  const deleteStep = async (id: number, idx: number) => {
    await deleteStepM({ variables: { id } });

    await refetch();

    setCurrentStepIdx(idx - 1 || 0);
  };

  return (
    <div className="w-2/12 py-5 bg-white">
      <ol>
        {data.lesson?.steps &&
          data.lesson.steps.map((step, i) => {
            return (
              <li
                className={`${
                  currentStepIdx === i ? "text-blue-600" : ""
                } list-none cursor-pointer w-full flex justify-between items-center ${
                  styles.STEP
                }`}
                key={step.id}
                onClick={() => setCurrentStepIdx(i)}
              >
                <span>Step {i + 1}</span>
                <Icon
                  name="minus-circled"
                  className="text-red-600 hidden"
                  onClick={() => deleteStep(step.id, i)}
                />
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
  refetch: any;
  currentStepIdx: number;
  setCurrentStepIdx: (n: number) => void;
};

export default Steps;
