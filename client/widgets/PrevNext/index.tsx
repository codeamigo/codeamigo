import React from 'react';

import Icon from '👨‍💻components/Icon';

const PrevNext: React.FC<Props> = ({
  currentStep,
  disabled,
  setCurrentStep,
  steps,
}) => {
  const nextDisabled = currentStep === steps - 1 || disabled;

  return (
    <div className="flex items-center gap-2">
      <button
        className={`rounded-md bg-gray-800 px-2 py-1 text-gray-200 hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-40`}
        disabled={currentStep === 0}
        onClick={() => setCurrentStep(currentStep - 1)}
      >
        <Icon
          className={currentStep === 0 ? 'cursor-not-allowed' : ''}
          name="left"
        />
      </button>
      <button
        className="rounded-md bg-gray-800 px-2 py-1 text-gray-200 hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-40"
        disabled={nextDisabled}
        onClick={() => setCurrentStep(currentStep + 1)}
      >
        <Icon
          className={currentStep === steps - 1 ? 'cursor-not-allowed' : ''}
          name="right"
        />
      </button>
    </div>
  );
};

type Props = {
  currentStep: number;
  disabled: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: any;
};

export default PrevNext;
