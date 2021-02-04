import { useRouter } from 'next/router';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import { useSessionsQuery } from '👨‍💻generated/graphql';

import SessionItem from './SessionItem';

const SessionsList: React.FC<Props> = () => {
  const router = useRouter();

  const { data, loading } = useSessionsQuery({
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data?.sessions) return null;
  if (loading) return <>Loading...</>;

  return (
    <div>
      <h2 className="border-b-2 text-xl text-text-primary font-bold mb-4">
        🤓 Recent Activity
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data?.sessions.length ? (
          data?.sessions.map((session) => {
            return <SessionItem key={session.id} session={session} />;
          })
        ) : (
          <div
            className="flex flex-col justify-center items-center h-32 w-32 bg-gray-100 text-gray-600 rounded-md cursor-pointer hover:text-blue-600 transform hover:scale-105 transition-colors transition-transform duration-300"
            onClick={() => router.push('/')}
          >
            <Icon className="text-xl" name="plus-squared" />
            <p className="text-sm font-bold">Find Lessons</p>
          </div>
        )}
      </div>
    </div>
  );
};

type Props = {};

export default SessionsList;
