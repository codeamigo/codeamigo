import React from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';

const PrevNext: React.FC<Props> = ({
  currentStep,
  disabled,
  setCurrentStep,
  steps,
}) => {
  const nextDisabled = currentStep === steps - 1 || disabled;
  const isLastStep = currentStep === steps - 1;

  return (
    <div>
      {isLastStep ? (
        <div className="flex items-center justify-center gap-2 bg-black py-2">
          <Button
            onClick={() =>
              window.open('https://forms.gle/PtW2z4ehfhikHooy5', '_blank')
            }
          >
            <Icon className="mr-1.5" name="plus-circled" />
            <span>Join Waitlist</span>
          </Button>
        </div>
      ) : (
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
      )}
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
