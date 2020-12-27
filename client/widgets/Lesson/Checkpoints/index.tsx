import React, { useEffect, useState } from "react";

import {
  useCreateCheckpointMutation,
  useDeleteCheckpointMutation,
  RegularCheckpointFragment,
  RegularStepFragment,
} from "@generated/graphql";

const Checkpoints: React.FC<Props> = ({ step }: Props) => {
  const [createCheckpointM] = useCreateCheckpointMutation();
  const [deleteCheckpointM] = useDeleteCheckpointMutation();
  const [checkpoints, setCheckpoints] = useState(
    [] as Array<RegularCheckpointFragment>
  );

  useEffect(() => {
    setCheckpoints(step?.checkpoints || []);
  }, [step?.checkpoints]);

  const createCheckpoint = async () => {
    const len = step?.checkpoints?.length || 0;

    await createCheckpointM({
      variables: { stepId: step.id, checkpointId: len + 1 },
      refetchQueries: ["Step"],
    });
  };

  const deleteCheckpoint = async (id: number) => {
    await deleteCheckpointM({ variables: { id }, refetchQueries: ["Step"] });
  };

  return (
    <>
      {checkpoints.length
        ? checkpoints.map((checkpoint, i) => {
            return (
              <div key={checkpoint.id} className="mb-6">
                <h3>
                  <span>Checkpoint {i + 1} </span>
                  {i === checkpoints.length - 1 ? (
                    <button
                      onClick={() => deleteCheckpoint(checkpoint.id)}
                      className="inline-flex justify-center py-1 px-2 border border-transparent shadow-xs text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50"
                      type="button"
                    >
                      Delete
                    </button>
                  ) : null}
                </h3>
                <div>Markdown editor</div>
              </div>
            );
          })
        : null}
      <div className="mt-4 my-8">
        <button
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={createCheckpoint}
          type="button"
        >
          Add Checkpoint
        </button>
      </div>
    </>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Checkpoints;
