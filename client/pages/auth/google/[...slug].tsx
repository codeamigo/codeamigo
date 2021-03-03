import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useGoogleLoginMutation } from '👨‍💻generated/graphql';

const GithubHandler: React.FC<Props> = () => {
  const router = useRouter();
  const [login] = useGoogleLoginMutation();

  useEffect(() => {
    if (router.query.slug) {
      const doLogin = async () => {
        const [username, email, id] = router.query.slug as string[];

        await login({
          variables: {
            email,
            id,
            username,
          },
        });

        router.replace('/');
      };

      doLogin();
    }
  }, [router.query.slug]);

  return null;
};

type Props = {};

export default GithubHandler;
