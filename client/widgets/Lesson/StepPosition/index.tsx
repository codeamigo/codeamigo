import React from 'react';

const StepPosition: React.FC<Props> = ({ currentStepNum, totalStepsNum }) => {
  return (
    <div className="text-sm font-bold text-text-primary">
      <span className="hidden md:inline-block">Step</span> {currentStepNum}/
      {totalStepsNum}
    </div>
  );
};

type Props = {
  currentStepNum: number;
  totalStepsNum: number;
};

export default StepPosition;
