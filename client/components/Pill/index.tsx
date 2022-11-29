import React from 'react';

const Pill: React.FC<Props> = ({ children }) => {
  return (
    <span className="py-0.5 px-1 text-xs font-semibold text-white bg-accent-faded rounded-md border border-accent">
      {children}
    </span>
  );
};

type Props = {};

export default Pill;
