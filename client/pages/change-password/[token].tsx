import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';

const ChangePassword: NextPage<{ token: string }> = (props) => {
  const router = useRouter();

  useEffect(() => {
    modalVar({
      callback: () => null,
      data: props.token,
      name: 'changePassword',
      persistent: false,
    });
    router.replace('/');
  }, []);

  return null;
};

ChangePassword.getInitialProps = ({ query }) => ({
  token: query.token as string,
});

export default ChangePassword;
