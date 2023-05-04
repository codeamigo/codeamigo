import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useGoogleLoginMutation } from '👨‍💻generated/graphql';

const SignIn: React.FC<Props> = () => {
  const router = useRouter();

  useEffect(() => {
    console.log(router.query);
  }, [router.query]);

  return null;
};

type Props = {};

export default SignIn;
