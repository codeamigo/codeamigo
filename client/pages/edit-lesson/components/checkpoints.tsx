import React, { useEffect, useState } from "react";
import {
  CodeModule,
  RegularCheckpointFragment,
  RegularStepFragment,
  Step,
  useCreateCheckpointMutation,
  useStepQuery,
} from "../../../generated/graphql";

const Checkpoints: React.FC<Props> = ({ step }: Props) => {
  const { data, refetch } = useStepQuery({ variables: { id: step.id } });
  const [createCheckpoint] = useCreateCheckpointMutation();
  const [checkpoints, setCheckpoints] = useState(
    [] as Array<RegularCheckpointFragment>
  );

  useEffect(() => {
    console.log(data)
    setCheckpoints(data?.step?.checkpoints || []);
  }, [data?.step?.checkpoints]);

  const addCheckpoint = async () => {
    const len = data?.step?.checkpoints?.length || 0;

    await createCheckpoint({ variables: { stepId: step.id, checkpointId: len + 1 } });
    refetch()
  };

  return (
    <>
      {checkpoints.length ? <div>checkpoints!</div> : null}
      <div>
        <button type="button" onClick={addCheckpoint}>
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
