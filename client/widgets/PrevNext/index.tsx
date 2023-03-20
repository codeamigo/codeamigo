import React from 'react';

import Icon from '👨‍💻components/Icon';

const PrevNext: React.FC<Props> = () => {
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-md bg-gray-800 px-2 py-1 text-gray-200 hover:bg-gray-900">
        <Icon className="" name="left" />
      </button>
      <button className="rounded-md bg-gray-800 px-2 py-1 text-gray-200 hover:bg-gray-900">
        <Icon className="" name="right" />
      </button>
    </div>
  );
};

type Props = {};

export default PrevNext;
