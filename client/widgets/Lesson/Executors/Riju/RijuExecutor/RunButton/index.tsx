import React from 'react';

import Icon from '👨‍💻components/Icon';

const RunButton: React.FC<Props> = ({ run }) => {
  return (
    <div
      className="rounded-full flex items-center justify-center bg-bg-nav h-12 w-12 box-content border-4 border-bg-nav-offset cursor-pointer"
      onClick={run}
      role="button"
    >
      <Icon className="text-text-primary text-2xl ml-0.5" name="play" />
    </div>
  );
};

type Props = {
  run: () => void;
};

export default RunButton;
