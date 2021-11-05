import React from 'react';

const Pill: React.FC<Props> = ({ children }) => {
  return (
    <span className="py-0.5 px-1 text-xs font-semibold text-white rounded-md border bg-accent-faded border-accent">
      {children}
    </span>
  );
};

type Props = {};

export default Pill;
