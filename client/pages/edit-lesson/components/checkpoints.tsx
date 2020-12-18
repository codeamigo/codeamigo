import React, { useEffect, useState } from "react";
import {
  RegularCheckpointFragment,
  RegularStepFragment,
  useDeleteCheckpointMutation,
  useCreateCheckpointMutation,
  useStepQuery,
} from "../../../generated/graphql";

const Checkpoints: React.FC<Props> = ({ step }: Props) => {
  const { data, refetch } = useStepQuery({ variables: { id: step.id } });
  const [createCheckpointM] = useCreateCheckpointMutation();
  const [deleteCheckpointM] = useDeleteCheckpointMutation();
  const [checkpoints, setCheckpoints] = useState(
    [] as Array<RegularCheckpointFragment>
  );

  useEffect(() => {
    console.log(data);
    setCheckpoints(data?.step?.checkpoints || []);
  }, [data?.step?.checkpoints]);

  const createCheckpoint = async () => {
    const len = data?.step?.checkpoints?.length || 0;

    await createCheckpointM({
      variables: { stepId: step.id, checkpointId: len + 1 },
    });

    refetch();
  };

  const deleteCheckpoint = async (id: number) => {
    await deleteCheckpointM({ variables: { id } });

    refetch();
  };

  return (
    <>
      {checkpoints.length
        ? checkpoints.map((checkpoint, i) => {
            return (
              <div key={checkpoint.id}>
                <h3>Checkpoint {i + 1}</h3>
                <div>Markdown editor</div>

                {i === checkpoints.length - 1 ? (
                  <button onClick={() => deleteCheckpoint(checkpoint.id)}>
                    Delete Checkpoint
                  </button>
                ) : null}
              </div>
            );
          })
        : null}
      <div>
        <button type="button" onClick={createCheckpoint}>
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
