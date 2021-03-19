import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import {
  useCreateSessionMutation,
  useMeQuery,
  useSessionQuery,
} from '👨‍💻generated/graphql';

const StartLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const router = useRouter();
  const [createSession] = useCreateSessionMutation();
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data, loading } = useSessionQuery({
    fetchPolicy: 'cache-and-network',
    variables: { lessonId: id },
  });

  useEffect(() => {
    async function create() {
      if (loading) return;
      if (meLoading) return;

      if (!meData?.me?.isAuthenticated) {
        router.replace(`/lessons/preview/${id}`);
      } else if (!data?.session?.id) {
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
  }, [loading, meLoading]);

  // handle
  return null;
};

StartLesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default StartLesson;
