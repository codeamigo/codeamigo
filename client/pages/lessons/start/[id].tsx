import {
  useCreateSessionMutation,
  useMeQuery,
  useSessionQuery,
} from '@generated/graphql';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

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
    if (meLoading) return;

    if (!meData?.me) router.push('/');
  }, [meData]);

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
