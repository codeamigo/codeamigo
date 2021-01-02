import React from 'react';

import TopNav from './TopNav';

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <TopNav />
      {children}
    </div>
  );
};

type Props = {};

export default MainLayout;
