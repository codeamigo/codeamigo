import React from 'react';

import Container from './Container';
import Footer from './Footer';
import TopNav from './TopNav';

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <TopNav />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

type Props = {};

export default MainLayout;
