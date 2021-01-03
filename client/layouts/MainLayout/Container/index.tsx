import React from 'react';

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-2 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
      {children}
    </div>
  );
};

type Props = {};

export default Container;
