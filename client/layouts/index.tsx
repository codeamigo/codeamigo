import React from 'react';

import LessonLayout from './LessonLayout';
import MainLayout from './MainLayout';

const Layout: React.FC<{ pathname: string }> = ({ children, pathname }) => {
  console.log(pathname);
  switch (pathname) {
    case '/me':
      return <MainLayout>{children}</MainLayout>;
    case '/lessons/[id]':
    case '/lessons/edit/[id]':
      return <LessonLayout>{children}</LessonLayout>;
    default:
      return <MainLayout>{children}</MainLayout>;
  }
};

export default Layout;
