import { useRouter } from 'next/router';
import React from 'react';

import { useSessionsQuery } from '👨‍💻generated/graphql';

import SessionItem from './SessionItem';

const SessionsList: React.FC<Props> = () => {
  const { data } = useSessionsQuery({
    fetchPolicy: 'cache-and-network',
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.sessions.map((session) => {
        return <SessionItem key={session.id} session={session} />;
      })}
    </div>
  );
};

type Props = {};

export default SessionsList;
