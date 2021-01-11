import { useRouter } from 'next/router';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import {
  useDeleteSessionMutation,
  useMeQuery,
  useSessionsQuery,
} from '👨‍💻generated/graphql';
import withApollo from '👨‍💻utils/withApollo';

const Me = () => {
  const router = useRouter();

  const { data, error, loading } = useMeQuery();
  const { data: sessionsData } = useSessionsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [deleteSession] = useDeleteSessionMutation();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>{data?.me?.id}</div>
      <div>{data?.me?.username}</div>

      <div className="grid grid-cols-4 gap-6">
        {sessionsData?.sessions.map((session) => {
          return (
            <div
              className="p-3 rounded-lg border-gray-200 border-2 relative"
              key={session.id}
            >
              <h2 className="text-xl">Lesson Id: {session.lessonId}</h2>
              <button
                onClick={() => router.push(`/lessons/${session.lessonId}`)}
              >
                Continue
              </button>

              <Icon
                className="text-red-800 absolute top-2 right-2"
                name="trash"
                onClick={() =>
                  deleteSession({
                    refetchQueries: ['Sessions'],
                    variables: { id: session.id },
                  })
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withApollo({ ssr: false })(Me);
