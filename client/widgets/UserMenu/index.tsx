import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { isAuthenticatedVar } from '👨‍💻apollo/cache/me';
import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { useLogoutMutation, useMeQuery } from '👨‍💻generated/graphql';

const UserMenu: React.FC<Props> = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery({ fetchPolicy: 'cache-and-network' });
  const [logout] = useLogoutMutation({ refetchQueries: ['Me'] });

  if (loading) return null;

  return (
    <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-4 sm:pr-0">
      {data?.me?.isAuthenticated ? (
        <div className="relative">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button
                  aria-haspopup="true"
                  className={`bg-bg-nav flex text-sm rounded-full outline-none focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${
                    open ? 'focus:ring-2' : ''
                  }`}
                >
                  <span className="sr-only">Open user menu</span>
                  <Icon
                    className="text-text-primary text-lg h-8 w-8 rounded-full"
                    name="user"
                  />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                  show={open}
                >
                  <div
                    aria-labelledby="user-menu"
                    aria-orientation="vertical"
                    className="origin-top-right bg-bg-primary absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                    role="menu"
                  >
                    <button
                      className="w-full inline-block text-left px-4 py-2 text-sm text-text-primary hover:bg-accent hover:text-bg-primary"
                      onClick={() => router.push('/me')}
                      role="menuitem"
                    >
                      Your Profile
                    </button>
                    <button
                      className="w-full inline-block text-left px-4 py-2 text-sm text-text-primary hover:bg-accent hover:text-bg-primary"
                      onClick={() => {
                        router.push('/');
                        logout();
                        isAuthenticatedVar(false);
                      }}
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      ) : (
        <>
          <button
            className="hover:text-gray-300 transition duration-150 text-text-primary px-3 py-1.5 rounded-md text-sm font-medium"
            onClick={() =>
              modalVar({
                callback: () => null,
                name: 'login',
              })
            }
            role="button"
          >
            Login
          </button>

          <button
            className="border-2 border-white hover:border-gray-300 hover:text-gray-300 transition duration-150 text-text-primary px-3 py-1.5 rounded-md text-sm font-medium"
            onClick={() =>
              modalVar({
                callback: () => null,
                name: 'register',
              })
            }
            role="button"
          >
            Sign Up
          </button>
        </>
      )}

      {/* <!-- Profile dropdown --> */}
    </div>
  );
};

type Props = {};

export default UserMenu;
