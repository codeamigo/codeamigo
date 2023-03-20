import React from 'react';

import Container from './Container';

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};

type Props = {};

export default MainLayout;
