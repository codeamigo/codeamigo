import {
  RegularCheckpointFragment,
  RegularStepFragment,
  useCreateCheckpointMutation,
  useDeleteCheckpointMutation,
} from '@generated/graphql';
import React, { useEffect, useState } from 'react';

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
      refetchQueries: ['Step'],
      variables: { checkpointId: len + 1, stepId: step.id },
    });
  };

  const deleteCheckpoint = async (id: number) => {
    await deleteCheckpointM({ refetchQueries: ['Step'], variables: { id } });
  };

  return (
    <>
      {checkpoints.length
        ? checkpoints.map((checkpoint, i) => {
            return (
              <div className="mb-6" key={checkpoint.id}>
                <h3>
                  <span>Checkpoint {i + 1} </span>
                  {i === checkpoints.length - 1 ? (
                    <button
                      className="inline-flex justify-center py-1 px-2 border border-transparent shadow-xs text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50"
                      onClick={() => deleteCheckpoint(checkpoint.id)}
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
