import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { getLessonCurrentStepId } from '👨‍💻apollo/localStorage';
import {
  useCreateSessionMutation,
  useMeQuery,
  useSessionQuery,
  useUpdateLessonViewsMutation,
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
  const [updateLessonViews] = useUpdateLessonViewsMutation();

  useEffect(() => {
    updateLessonViews({ variables: { id } });
  }, []);

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
          variables: {
            currentStepId: getLessonCurrentStepId(id),
            lessonId: id,
          },
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
