import React from 'react';

const Jest: React.FC<Props> = () => {
  return <div>Jest step</div>;
};

type Props = {
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
};

export default Jest;
