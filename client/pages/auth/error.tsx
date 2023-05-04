import { useRouter } from 'next/router';
import React from 'react';

const AuthError: React.FC<Props> = () => {
  const router = useRouter();
  console.log(router.query);

  return <div></div>;
};

type Props = {};

export default AuthError;
