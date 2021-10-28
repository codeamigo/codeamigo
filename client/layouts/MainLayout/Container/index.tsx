import React from 'react';

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="py-2 sm:py-4 lg:py-6 px-2 sm:px-6 lg:px-8 mx-auto max-w-7xl min-h-screen">
      {children}
    </div>
  );
};

type Props = {};

export default Container;
