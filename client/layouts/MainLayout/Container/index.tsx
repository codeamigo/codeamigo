import React from 'react';

const Container: React.FC<Props> = ({ children }) => {
  return <div className="w-full h-full">{children}</div>;
};

type Props = {};

export default Container;
