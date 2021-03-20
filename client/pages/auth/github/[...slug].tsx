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
        const [accessToken, id, username, redirection] = router.query
          .slug as string[];

        await login({
          awaitRefetchQueries: true,
          refetchQueries: ['Me'],
          variables: {
            accessToken,
            id: parseInt(id),
            username,
          },
        });

        // if the user was previewing replace w/ start
        const url = redirection.replace('preview', 'start');

        router.replace(url);
      };

      doLogin();
    }
  }, [router.query.slug]);

  return null;
};

type Props = {};

export default GithubHandler;
