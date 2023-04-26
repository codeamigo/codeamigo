import V2Layout from 'layouts/V2Layout';
import React, { useEffect } from 'react';
import { DEFAULT_THEME } from 'styles/appThemes';
import { applyTheme } from 'styles/appThemes/utils';

import LessonLayout from './LessonLayout';
import MainLayout from './MainLayout';

const Layout: React.FC<{ pathname: string }> = ({ children, pathname }) => {
  switch (pathname) {
    case '/v2':
    case '/v2/lesson/[lesson-slug]/step/[step-slug]':
      return <V2Layout>{children}</V2Layout>;
    case '/lessons/[id]':
    case '/lessons/edit/[id]':
    case '/lessons/start/[id]':
    case '/lessons/preview/[id]':
      return <LessonLayout>{children}</LessonLayout>;
    default:
      return <MainLayout>{children}</MainLayout>;
  }
};

export default Layout;
