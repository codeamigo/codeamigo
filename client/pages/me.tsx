import React from 'react';

import { useMeQuery } from '👨‍💻generated/graphql';
import withApollo from '👨‍💻utils/withApollo';
import SessionsList from '👨‍💻widgets/SessionsList';

const Me = () => {
  const { data, error, loading } = useMeQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col sm:space-x-8 sm:flex-row">
      <div className="sm:w-1/4 w-full mb-4">
        <div>{data?.me?.username}</div>
      </div>
      <div className="sm:w-3/4 w-full">
        <SessionsList />
      </div>
    </div>
  );
};

export default withApollo({ ssr: false })(Me);
