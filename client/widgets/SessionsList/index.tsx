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

  if (loading && !data?.sessions)
    return <div className="text-text-primary">Loading...</div>;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-text-primary border-b-2">
        🤓 Recent Activity
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.sessions.length ? (
          data?.sessions.map((session) => {
            return <SessionItem key={session.id} session={session} />;
          })
        ) : (
          <div
            className="flex flex-col justify-center items-center w-32 h-32 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
