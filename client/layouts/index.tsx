import AuthCallbackLayout from 'layouts/AuthCallbackLayout';
import V2Layout from 'layouts/V2Layout';
import React from 'react';

import MainLayout from './MainLayout';

const Layout: React.FC<{ pathname: string }> = ({ children, pathname }) => {
  switch (pathname) {
    case '/v2/lesson/[lesson-slug]/step/[step-slug]':
      return <V2Layout>{children}</V2Layout>;
    case '/auth/signin':
      return <AuthCallbackLayout>{children}</AuthCallbackLayout>;
    default:
      return <MainLayout>{children}</MainLayout>;
  }
};

export default Layout;
