import React from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  RegularStepFragment,
  useCreateSpecCheckpointMutation,
} from '👨‍💻generated/graphql';

const Jest: React.FC<Props> = ({ setWizardStep, step }) => {
  const [createSpecCheckpointM] = useCreateSpecCheckpointMutation();
  const createSpecCheckpoint = async () => {
    const len = step.checkpoints?.length || 0;

    await createSpecCheckpointM({
      refetchQueries: ['Checkpoints', 'Step'],
      variables: {
        checkpointId: len + 1,
        stepId: step.id,
      },
    });
  };

  return (
    <div className="text-text-primary">
      <div className="flex">
        <Icon className="text-lg block mr-2" name="jest" />
        <h3 className="text-lg font-bold">Jest</h3>
      </div>
      <div className="mt-2 mb-4">
        Create a checkpoint.spec.ts file. Only available for languages that
        support in-browser execution (HTML/CSS/JS).
      </div>
      <div className="flex items-center mt-2">
        <Icon
          className="text-md mr-4"
          name="left-bold"
          onClick={() => setWizardStep('select')}
          role="button"
        />
        <Button onClick={createSpecCheckpoint} type="submit">
          Create
        </Button>
      </div>
    </div>
  );
};

type Props = {
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
  step: RegularStepFragment;
};

export default Jest;
