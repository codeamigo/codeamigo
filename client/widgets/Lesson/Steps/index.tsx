import React from "react";
import Icon from "@components/Icon";
import {
  RegularStepFragment,
  useCreateStepMutation,
  useDeleteStepMutation,
} from "@generated/graphql";

import styles from "./Steps.module.scss";

const Steps: React.FC<Props> = ({
  steps,
  refetch,
  lessonId,
  currentStepId,
  setCurrentStepId,
}) => {
  const [createStepM] = useCreateStepMutation();
  const [deleteStepM] = useDeleteStepMutation();

  const createStep = async () => {
    const step = await createStepM({
      variables: { lessonId },
    });

    await refetch();

    if (!step.data?.createStep?.id) return;

    setCurrentStepId(step.data?.createStep?.id);
  };

  const deleteStep = async (id: number, idx: number) => {
    const sortedSteps = steps
      .slice()
      .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1));

    await deleteStepM({ variables: { id } });

    await refetch();

    setCurrentStepId(sortedSteps[idx - 1].id);
  };

  return (
    <div className="w-2/12 py-5 bg-white">
      <ol>
        {steps
          .slice()
          .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1))
          .map((step, i) => {
            return (
              <li
                className={`${
                  currentStepId === step.id ? "text-blue-600" : ""
                } list-none cursor-pointer w-full flex justify-between items-center ${
                  styles.STEP
                }`}
                key={step.id}
                onClick={() => setCurrentStepId(step.id)}
              >
                <span>Step {step.id}</span>
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
  refetch: any;
  lessonId: number;
  currentStepId: number;
  steps: RegularStepFragment[];
  setCurrentStepId: (n: number) => void;
};

export default Steps;
