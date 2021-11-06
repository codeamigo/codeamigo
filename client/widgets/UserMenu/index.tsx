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
        className="-mr-1 sm:mr-0 w-8 h-8 text-lg rounded-full animate-pulse text-text-primary"
        name="user"
      />
    );

  return (
    <div className="flex sm:static sm:inset-auto inset-y-0 right-0 items-center pr-0">
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
                    className="-mr-1 sm:mr-0 w-8 h-8 text-lg rounded-full text-text-primary"
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
                    className="absolute right-0 py-1 mt-2 w-48 rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right bg-bg-primary"
                    role="menu"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`w-full inline-block text-left px-4 py-2 text-sm ${
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
                          className={`w-full inline-block text-left px-4 py-2 text-sm ${
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
            className="py-1.5 sm:px-3 pl-3 text-sm font-medium text-right sm:text-center rounded-md transition duration-150 text-text-primary"
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
            className="hidden sm:block py-1 sm:py-1.5 px-1 sm:px-3 text-sm font-medium whitespace-nowrap rounded-md border-2 transition duration-150 text-text-primary border-bg-nav-offset"
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
