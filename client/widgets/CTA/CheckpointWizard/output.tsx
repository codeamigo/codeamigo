import React from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';

const Output: React.FC<Props> = ({ setWizardStep }) => {
  return (
    <div className="text-text-primary">
      <div className="flex">
        <Icon className="text-lg block mr-2" name="terminal" />
        <h3 className="text-lg font-bold">Output</h3>
      </div>
      <div className="mt-2 mb-4">
        Test the program's output with a strict equality check.
      </div>
      <div className="flex justify-between items-center mt-2">
        <Icon
          className="text-md mr-4"
          name="left-bold"
          onClick={() => setWizardStep('select')}
          role="button"
        />
        <Button type="submit">Submit</Button>
      </div>
    </div>
  );
};

type Props = {
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
};

export default Output;
