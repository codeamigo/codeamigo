import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { useMeQuery } from '👨‍💻generated/graphql';
import withApollo from '👨‍💻utils/withApollo';

const Me = () => {
  const router = useRouter();
  const { data, error, loading } = useMeQuery();

  const [tab, setTab] = useState<string | undefined>(
    (router.query.tab as string) || 'activity'
  );

  useEffect(() => {
    if (!router.query.tab) return;
    setTab(router.query.tab as string);
  }, [router.query.tab]);

  useEffect(() => {
    if (tab !== router.query.tab) {
      router.push(`/me?tab=${tab}`);
    }
  }, [tab]);

  if (loading) return <div className="text-text-primary">Loading...</div>;
  // if (error) return <div>{error.toString()}</div>;

  return (
    <div className="flex flex-col sm:flex-row sm:space-x-8">
      <div className="mb-4 w-full sm:w-1/4">
        <div className="sticky top-3">
          <h2 className="text-text-primary mb-2 font-semibold">
            User: {data?.me?.username}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(Me);
