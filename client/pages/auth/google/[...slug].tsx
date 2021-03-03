import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useGoogleLoginMutation } from '👨‍💻generated/graphql';

const GoogleHandler: React.FC<Props> = () => {
  const router = useRouter();
  const [login] = useGoogleLoginMutation();

  useEffect(() => {
    if (router.query.slug) {
      const doLogin = async () => {
        const [username, email, id, redirection] = router.query
          .slug as string[];

        await login({
          awaitRefetchQueries: true,
          refetchQueries: ['Me'],
          variables: {
            email,
            id,
            username,
          },
        });

        router.replace(redirection);
      };

      doLogin();
    }
  }, [router.query.slug]);

  return null;
};

type Props = {};

export default GoogleHandler;
