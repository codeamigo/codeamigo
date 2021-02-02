import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { useMeQuery } from '👨‍💻generated/graphql';
import withApollo from '👨‍💻utils/withApollo';
import Backoffice from '👨‍💻widgets/Backoffice';
import SessionsList from '👨‍💻widgets/SessionsList';
import UserLessonsList from '👨‍💻widgets/UserLessonsList';

const Me = () => {
  const router = useRouter();
  const { data, error, loading } = useMeQuery();

  const [tab, setTab] = useState<string | undefined>('activity');

  useEffect(() => {
    if (!router.query.tab) return;
    setTab(router.query.tab as string);
  }, [router.query.tab]);

  useEffect(() => {
    if (tab !== router.query.tab) {
      router.replace(`/me?tab=${tab}`);
    }
  }, [tab]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col sm:space-x-8 sm:flex-row">
      <div className="sm:w-1/4 w-full mb-4">
        <h2 className="text-primary font-semibold mb-2">
          User: {data?.me?.username}
        </h2>
        <button
          className={`${
            tab === 'activity' ? 'bg-ternary-bg' : ''
          } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-blue-600 hover:bg-ternary-bg transition-colors text-left`}
          onClick={() => setTab('activity')}
        >
          <Icon className="mr-2" name="bell" /> Recent Activity
        </button>
        <button
          className={`${
            tab === 'lessons' ? 'bg-ternary-bg' : ''
          } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-blue-600 hover:bg-ternary-bg transition-colors text-left`}
          onClick={() => setTab('lessons')}
        >
          <Icon className="mr-2" name="book-open" /> Your Lessons
        </button>
        {data?.me?.role === 'ADMIN' && (
          <button
            className={`${
              tab === 'backoffice' ? 'bg-ternary-bg' : ''
            } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-blue-600 hover:bg-ternary-bg transition-colors text-left`}
            onClick={() => setTab('backoffice')}
          >
            <Icon className="mr-2" name="flashlight" /> Backoffice
          </button>
        )}
      </div>
      <div className="sm:w-3/4 w-full">
        {tab === 'activity' && <SessionsList />}
        {tab === 'lessons' && <UserLessonsList />}
        {tab === 'backoffice' && <Backoffice />}
      </div>
    </div>
  );
};

export default withApollo({ ssr: false })(Me);
