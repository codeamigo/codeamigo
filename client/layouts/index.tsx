import React from 'react';

import LessonLayout from './LessonLayout';
import MainLayout from './MainLayout';

const Layout: React.FC<{ pathname: string }> = ({ children, pathname }) => {
  switch (pathname) {
    case '/lessons/[id]':
    case '/lessons/edit/[id]':
    case '/lessons/start/[id]':
    case '/lessons/create':
      return <LessonLayout>{children}</LessonLayout>;
    default:
      return <MainLayout>{children}</MainLayout>;
  }
};

export default Layout;
