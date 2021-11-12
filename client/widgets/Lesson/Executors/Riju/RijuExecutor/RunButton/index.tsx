import React, { useEffect } from 'react';

import Icon from '👨‍💻components/Icon';
import { Spinner } from '👨‍💻components/Spinners';

const RunButton: React.FC<Props> = ({ isExecuting, run }) => {
  const handleClick = () => {
    run();
  };

  return (
    <div
      aria-label={'or cmd + e'}
      className={`box-content flex justify-center items-center w-12 h-12 rounded-full border-4 bg-bg-nav border-bg-nav-offset hint--top ${
        isExecuting ? 'cursor-wait' : 'cursor-pointer'
      }`}
      onClick={handleClick}
      role="button"
    >
      {isExecuting ? (
        <div className="flex justify-center items-center w-full h-full">
          <Spinner />
        </div>
      ) : (
        <Icon
          className="ml-0.5 h-full text-2xl text-text-primary"
          name="play"
        />
      )}
    </div>
  );
};

type Props = {
  isExecuting: boolean;
  run: () => void;
};

export default RunButton;
