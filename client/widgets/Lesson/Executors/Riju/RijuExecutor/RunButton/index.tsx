import React, { useEffect } from 'react';

import Icon from '👨‍💻components/Icon';

const RunButton: React.FC<Props> = ({ run }) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log(event);
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      aria-label={'or cmd + e'}
      className="box-content flex justify-center items-center w-12 h-12 rounded-full border-4 cursor-pointer bg-bg-nav border-bg-nav-offset hint--top"
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
