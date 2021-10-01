import React from 'react';

const Output: React.FC<Props> = () => {
  return <div>Output step</div>;
};

type Props = {
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
};

export default Output;
