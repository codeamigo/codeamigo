import React, { useEffect } from 'react';

import { useMeQuery } from '../../generated/graphql';
import { useGlobalState } from '../../state';

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useGlobalState('user');
  const { data, loading } = useMeQuery();

  useEffect(() => {
    setUser({
      ...user,
      data,
      loading,
    });
  }, [data?.me, loading]);

  return <>{children}</>;
};

type Props = {};

export default AuthProvider;
