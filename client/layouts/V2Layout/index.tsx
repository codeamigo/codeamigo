import React from 'react';

const V2Layout: React.FC<Props> = ({ children }) => {
  return <div className="v2 h-full w-full">{children}</div>;
};

type Props = {};

export default V2Layout;
