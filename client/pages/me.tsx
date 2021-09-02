import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { useMeQuery } from '👨‍💻generated/graphql';
import withApollo from '👨‍💻utils/withApollo';
import Backoffice from '👨‍💻widgets/Backoffice';
import EditProfilePic from '👨‍💻widgets/EditProfilePic';
import SessionsList from '👨‍💻widgets/SessionsList';
import Settings from '👨‍💻widgets/Settings';
import Themes from '👨‍💻widgets/Themes';
import UserLessonsList from '👨‍💻widgets/UserLessonsList';

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
    <div className="flex flex-col sm:space-x-8 sm:flex-row">
      <div className="sm:w-1/4 w-full mb-4">
        <EditProfilePic />
        <div className="sticky top-3">
          <h2 className="text-text-primary font-semibold mb-2">
            User: {data?.me?.username}
          </h2>
          <button
            className={`${
              tab === 'activity' ? 'bg-bg-nav' : ''
            } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-text-primary hover:bg-bg-nav transition-colors text-left`}
            onClick={() => setTab('activity')}
          >
            <Icon className="mr-2" name="bell" /> Recent Activity
          </button>
          <button
            className={`${
              tab === 'lessons' ? 'bg-bg-nav' : ''
            } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-text-primary hover:bg-bg-nav transition-colors text-left`}
            onClick={() => setTab('lessons')}
          >
            <Icon className="mr-2" name="book-open" /> Your Lessons
          </button>
          <button
            className={`${
              tab === 'themes' ? 'bg-bg-nav' : ''
            } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-text-primary hover:bg-bg-nav transition-colors text-left`}
            onClick={() => setTab('themes')}
          >
            <Icon className="mr-2" name="palette" /> Themes
          </button>
          <button
            className={`${
              tab === 'settings' ? 'bg-bg-nav' : ''
            } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-text-primary hover:bg-bg-nav transition-colors text-left`}
            onClick={() => setTab('settings')}
          >
            <Icon className="mr-2" name="cog" /> Settings
          </button>
          {data?.me?.role === 'ADMIN' && (
            <button
              className={`${
                tab === 'backoffice' ? 'bg-bg-nav' : ''
              } mt-2 flex items-center px-3 py-2 w-full rounded-md font-bold text-text-primary hover:bg-bg-nav transition-colors text-left`}
              onClick={() => setTab('backoffice')}
            >
              <Icon className="mr-2" name="flashlight" /> Backoffice
            </button>
          )}
        </div>
      </div>
      <div className="sm:w-3/4 w-full">
        {tab === 'activity' && <SessionsList />}
        {tab === 'lessons' && <UserLessonsList />}
        {tab === 'themes' && <Themes />}
        {tab === 'settings' && <Settings />}
        {tab === 'backoffice' && <Backoffice />}
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(Me);
