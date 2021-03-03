import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useGitHubLoginMutation } from '👨‍💻generated/graphql';

const GithubHandler: React.FC<Props> = () => {
  const router = useRouter();
  const [login] = useGitHubLoginMutation();

  console.log(router);

  useEffect(() => {
    if (router.query.slug) {
      const doLogin = async () => {
        const [accessToken, id, username] = router.query.slug as string[];

        await login({
          variables: {
            accessToken,
            id: parseInt(id),
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
