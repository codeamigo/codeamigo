import Footer from 'layouts/MainLayout/Footer';
import TopNav from 'layouts/MainLayout/TopNav';
import React from 'react';

import Container from './Container';

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
