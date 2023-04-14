import React from 'react';

const PrevNext: React.FC<Props> = ({
  currentStep,
  disabled,
  setCurrentStep,
  steps,
}) => {
  const nextDisabled = currentStep === steps - 1 || disabled;

  return (
    <div className="flex items-center justify-center gap-2 bg-black py-2">
      <button
        className={`rounded-md border border-neutral-800 bg-neutral-900 p-2 font-bold text-gray-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:opacity-40`}
        disabled={currentStep === 0}
        onClick={() => setCurrentStep(currentStep - 1)}
      >
        Prev
      </button>
      <button
        className="rounded-md border border-neutral-800 bg-neutral-900 p-2 font-bold text-gray-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:opacity-40"
        disabled={nextDisabled}
        onClick={() => setCurrentStep(currentStep + 1)}
      >
        Next
      </button>
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
