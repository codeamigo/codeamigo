import React from 'react';

import Button from '👨‍💻components/Button';

const PrevNext: React.FC<Props> = ({
  currentStep,
  disabled,
  setCurrentStep,
  steps,
}) => {
  const nextDisabled = currentStep === steps - 1 || disabled;

  return (
    <div>
      <div className="flex items-center justify-center gap-2 bg-black py-2">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          Prev
        </Button>
        <Button
          disabled={nextDisabled}
          onClick={() => setCurrentStep(currentStep + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

type Props = {
  currentStep: number;
  disabled: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: number;
};

export default PrevNext;
