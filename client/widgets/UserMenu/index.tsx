import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { isAuthenticatedVar } from '👨‍💻apollo/cache/me';
import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from '👨‍💻generated/graphql';

const UserMenu: React.FC<Props> = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery({ fetchPolicy: 'cache-and-network' });
  const [logout] = useLogoutMutation({
    refetchQueries: ['Me'],
    update: (store) => {
      store.writeQuery<MeQuery>({
        data: {
          me: null,
        },
        query: MeDocument,
      });
    },
  });

  if (loading)
    return (
      <Icon
        className="text-text-primary -mr-1 h-8 w-8 animate-pulse rounded-full text-lg sm:mr-0"
        name="user"
      />
    );

  return (
    <div className="inset-y-0 right-0 flex items-center pr-0 sm:static sm:inset-auto">
      {data?.me?.isAuthenticated ? (
        <div className="relative">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button
                  aria-haspopup="true"
                  className={`bg-bg-nav flex rounded-full text-sm outline-none focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    open ? 'focus:ring-2' : ''
                  }`}
                >
                  <span className="sr-only">Open user menu</span>
                  <Icon
                    className="text-text-primary -mr-1 h-8 w-8 rounded-full text-lg sm:mr-0"
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
                  <Menu.Items
                    aria-labelledby="user-menu"
                    aria-orientation="vertical"
                    className="bg-bg-primary absolute right-0 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    role="menu"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`inline-block w-full px-4 py-2 text-left text-sm ${
                            active
                              ? 'bg-accent text-bg-primary'
                              : 'text-text-primary'
                          }`}
                          onClick={() => router.push('/me')}
                        >
                          Your Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`inline-block w-full px-4 py-2 text-left text-sm ${
                            active
                              ? 'bg-accent text-bg-primary'
                              : 'text-text-primary'
                          }`}
                          onClick={() => {
                            router.push('/');
                            logout();
                            isAuthenticatedVar(false);
                          }}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      ) : (
        <>
          <button
            className="text-text-primary rounded-md py-1.5 pl-3 text-right text-sm font-medium transition duration-150 sm:px-3 sm:text-center"
            onClick={() =>
              modalVar({
                callback: () => null,
                name: 'login',
                persistent: false,
              })
            }
            role="button"
          >
            Login
          </button>

          <button
            className="text-text-primary border-bg-nav-offset hidden whitespace-nowrap rounded-md border-2 p-1 text-sm font-medium transition duration-150 sm:block sm:px-3 sm:py-1.5"
            onClick={() => {
              modalVar({
                callback: () =>
                  router.pathname.includes('/lessons/preview/[id]')
                    ? router.push(`/lessons/start/${router.query.id}`)
                    : null,
                name: 'register',
                persistent: false,
              });
            }}
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
