import React, { useEffect } from 'react';

import { isAuthenticatedVar } from '../../apollo/cache/me';
import { useMeQuery } from '../../generated/graphql';

const AuthProvider: React.FC<Props> = ({ children }) => {
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (data && data.me) {
      isAuthenticatedVar(true);
    }
  }, [data?.me, loading]);

  return <>{children}</>;
};

type Props = {};

export default AuthProvider;
