import React from 'react';
import { useMeQuery } from '../generated/graphql';
import withApollo from '../utils/withApollo';

const Me = () => {
  const { loading, error, data } = useMeQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>{data?.me?.id}</div>
      <div>{data?.me?.username}</div>
    </div>
  );
};

export default withApollo({ ssr: false })(Me);
