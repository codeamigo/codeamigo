import React, { useEffect } from 'react';
import { applyTheme } from 'styles/appThemes/utils';

import { useMeQuery } from '👨‍💻generated/graphql';

import LessonLayout from './LessonLayout';
import MainLayout from './MainLayout';

const Layout: React.FC<{ pathname: string }> = ({ children, pathname }) => {
  const { data, loading } = useMeQuery();
  const theme = loading ? null : data?.me ? data.me?.theme || 'idle' : 'idle';

  useEffect(() => {
    if (theme) {
      applyTheme(theme);
    }
  }, [theme]);

  if (!theme) return null;
  switch (pathname) {
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
