import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Icon from '../../../components/Icon';
import { useLogoutMutation } from '../../../generated/graphql';
import { useGlobalState } from '../../../state';

const TopNav: React.FC<Props> = () => {
  const router = useRouter();
  const [user, setUser] = useGlobalState('user');
  const [_, setModal] = useGlobalState('modal');

  const [logout] = useLogoutMutation({ refetchQueries: ['Me'] });

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              aria-expanded="false"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="none"
                  onClick={() => setMobileMenuOpen(false)}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="block h-6 w-6"
                  fill="none"
                  onClick={() => setMobileMenuOpen(true)}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block">
              <div className="flex space-x-4">
                <button
                  className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => router.push('/')}
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user.data && user.data.me && !user.loading ? (
              <div className="relative">
                <Menu>
                  {({ open }) => (
                    <>
                      <Menu.Button
                        aria-haspopup="true"
                        className={`bg-gray-800 flex text-sm rounded-full outline-none focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${
                          open ? 'focus:ring-2' : ''
                        }`}
                      >
                        <span className="sr-only">Open user menu</span>
                        <Icon
                          className="text-white h-8 w-8 rounded-full"
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
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                          role="menu"
                        >
                          <button
                            className="w-full inline-block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => router.push('/me')}
                            role="menuitem"
                          >
                            Your Profile
                          </button>
                          <button
                            className="w-full inline-block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              logout();
                              router.push('/');
                              setUser({ data: undefined, loading: false });
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
                  className="hover:text-gray-300 transition duration-150 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                  onClick={() =>
                    setModal({ callback: () => null, name: 'login' })
                  }
                  role="button"
                >
                  Login
                </button>

                <button
                  className="border-2 border-white hover:border-gray-300 hover:text-gray-300 transition duration-150 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                  onClick={() =>
                    setModal({ callback: () => null, name: 'register' })
                  }
                  role="button"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* <!-- Profile dropdown --> */}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
            <button
              className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => router.push('/me')}
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

type Props = {};

export default TopNav;
