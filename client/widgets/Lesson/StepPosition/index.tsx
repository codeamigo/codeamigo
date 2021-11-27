import React from 'react';

const StepPosition: React.FC<Props> = ({ currentStepNum, totalStepsNum }) => {
  return (
    <div className="text-sm font-bold text-text-primary">
      Step {currentStepNum}/{totalStepsNum}
    </div>
  );
};

type Props = {
  currentStepNum: number;
  totalStepsNum: number;
};

export default StepPosition;
