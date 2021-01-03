import React from 'react';

import Container from './Container';
import TopNav from './TopNav';

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <TopNav />
      <Container>{children}</Container>
    </>
  );
};

type Props = {};

export default MainLayout;
