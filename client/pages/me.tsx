import { useRouter } from 'next/router';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import {
  useDeleteSessionMutation,
  useMeQuery,
  useSessionsQuery,
} from '👨‍💻generated/graphql';
import withApollo from '👨‍💻utils/withApollo';
import LessonItem from '👨‍💻widgets/LessonsList/LessonItem';

const Me = () => {
  const router = useRouter();

  const { data, error, loading } = useMeQuery();
  const { client, data: sessionsData } = useSessionsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [deleteSession] = useDeleteSessionMutation();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col sm:space-x-8 sm:flex-row">
      <div className="sm:w-1/4 w-full mb-4">
        <div>{data?.me?.username}</div>
      </div>
      <div className="sm:w-3/4 w-full">
        <div className="grid grid-cols-4 gap-6">
          {sessionsData?.sessions.map((session) => {
            return <LessonItem key={session.id} lesson={session.lesson} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default withApollo({ ssr: false })(Me);
