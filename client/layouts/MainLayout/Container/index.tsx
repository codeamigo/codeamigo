import React from 'react';

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="mx-auto min-h-screen max-w-7xl p-2 sm:py-4 sm:px-6 lg:py-6 lg:px-8">
      {children}
    </div>
  );
};

type Props = {};

export default Container;
