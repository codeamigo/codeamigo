import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';

const AuthSignin: React.FC<Props> = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.error) {
      modalVar({
        callback: () => null,
        data: {},
        name: 'loginError',
        persistent: false,
      });
    }

    if (router.query.callbackUrl) {
      router.push(router.query.callbackUrl as string);
      return;
    }

    router.push('/');
  }, [router.isReady]);

  return <div></div>;
};

type Props = {};

export default AuthSignin;
