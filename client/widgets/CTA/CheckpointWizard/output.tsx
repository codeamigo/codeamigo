import { Form, Formik } from 'formik';
import React from 'react';

import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import Icon from '👨‍💻components/Icon';
import {
  RegularStepFragment,
  useCreateOutputCheckpointMutation,
} from '👨‍💻generated/graphql';

const Output: React.FC<Props> = ({ setWizardStep, step }) => {
  const [createOutputCheckpointM] = useCreateOutputCheckpointMutation();

  const createOutputCheckpoint = async (values: { output: string }) => {
    await createOutputCheckpointM({
      refetchQueries: ['Checkpoints', 'Step'],
      variables: {
        output: values.output,
        stepId: step.id,
      },
    });

    setWizardStep('select');
  };

  return (
    <div className="text-text-primary">
      <div className="flex">
        <Icon className="text-lg block mr-2" name="terminal" />
        <h3 className="text-lg font-bold">Output</h3>
      </div>
      <div className="mt-2 mb-4">
        Test the program's output with a strict equality check.
      </div>
      <Formik
        initialValues={{
          output: '',
        }}
        onSubmit={createOutputCheckpoint}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <div className="mt-3 mb-1">Program output</div>
            <InputField
              className="text-black"
              label=""
              name="output"
              required
              type="text"
            />
            <div className="flex items-center mt-3">
              <Icon
                className="text-md mr-4"
                name="left-bold"
                onClick={() => setWizardStep('select')}
                role="button"
              />
              <Button disabled={!isValid || isSubmitting} type="submit">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

type Props = {
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
  step: RegularStepFragment;
};

export default Output;
