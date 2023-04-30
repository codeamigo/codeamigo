import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { useLogoutMutation, useMeQuery } from '👨‍💻generated/graphql';

const UserMenu: React.FC<Props> = () => {
  const { data } = useMeQuery();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    const confirm = window.confirm('Are you sure you want to logout?');

    if (!confirm) return;
    await logout({
      refetchQueries: ['Me'],
    });
  };

  const handleLogin = () => {
    modalVar({
      callback: () => null,
      name: 'login',
      persistent: false,
    });
  };

  return (
    <div
      className="relative flex cursor-pointer gap-2 text-neutral-700 transition-colors hover:text-white"
      onClick={() => {
        if (data?.me?.username) {
          handleLogout();
        } else {
          handleLogin();
        }
      }}
      role="button"
    >
      {data?.me?.username ? (
        <pre className="hidden text-[10px] sm:inline-block">
          {data.me.username}
        </pre>
      ) : null}
      <Icon className="" name="user" />
      {data?.me ? (
        <div className="absolute right-[0px] top-[0px] flex h-[6px] w-[6px] items-center justify-center rounded-full bg-green-900">
          <div className="h-[4px] w-[4px] rounded-full bg-green-500" />
        </div>
      ) : (
        <div className="absolute right-[0px] top-[0px] flex h-[6px] w-[6px] items-center justify-center rounded-full bg-red-900">
          <div className="h-[4px] w-[4px] rounded-full bg-red-500" />
        </div>
      )}
    </div>
  );
};

type Props = {};

export default UserMenu;
