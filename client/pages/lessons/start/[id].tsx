import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import {
  useCreateSessionMutation,
  useSessionQuery,
} from '../../../generated/graphql';
import { useGlobalState } from '../../../state';

const StartLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const router = useRouter();
  const [user] = useGlobalState('user');
  const [createSession] = useCreateSessionMutation();
  const { data, loading } = useSessionQuery({
    fetchPolicy: 'cache-and-network',
    variables: { lessonId: id },
  });

  useEffect(() => {
    if (user.loading) return;

    if (!user.data?.me) router.push('/');
  }, [user]);

  useEffect(() => {
    async function create() {
      if (loading) return;

      if (!data?.session?.id) {
        await createSession({
          awaitRefetchQueries: true,
          refetchQueries: ['Session'],
          variables: { lessonId: id },
        });
        router.replace(`/lessons/${id}`);
      } else {
        router.replace(`/lessons/${id}`);
      }
    }

    create();
  }, [loading]);

  // handle
  return null;
};

StartLesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default StartLesson;
