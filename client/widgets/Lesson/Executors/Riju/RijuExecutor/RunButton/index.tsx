import React from 'react';

import Icon from '👨‍💻components/Icon';

const RunButton: React.FC<Props> = ({ run }) => {
  return (
    <div
      aria-label={'or cmd + e'}
      className="box-content flex justify-center items-center w-12 h-12 bg-bg-nav rounded-full border-4 border-bg-nav-offset cursor-pointer hint--top"
      onClick={run}
      role="button"
    >
      <Icon className="ml-0.5 h-full text-2xl text-text-primary" name="play" />
    </div>
  );
};

type Props = {
  run: () => void;
};

export default RunButton;
