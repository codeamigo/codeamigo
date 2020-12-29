import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import {
  useCreateSessionMutation,
  useSessionQuery,
} from '../../../generated/graphql';

const StartLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const router = useRouter();
  const [createSession] = useCreateSessionMutation();
  const { data, loading } = useSessionQuery({ variables: { lessonId: id } });

  useEffect(() => {
    async function create() {
      if (!loading && !data?.session?.id) {
        const s = await createSession({
          refetchQueries: ['Session'],
          variables: { lessonId: id },
        });
        console.log('created session', s);
        console.log('routing');
        router.push(`/lessons/${id}`);
      } else {
        router.push(`/lessons/${id}`);
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
