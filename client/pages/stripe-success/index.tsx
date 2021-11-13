import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';

const StripeRedirect: NextPage<{ token: string }> = (props) => {
  const router = useRouter();

  useEffect(() => {
    modalVar({
      callback: () => null,
      name: 'donationSuccess',
    });
    router.replace('/');
  }, []);

  return null;
};

export default StripeRedirect;
