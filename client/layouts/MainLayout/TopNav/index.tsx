import React from 'react';

import { useLogoutMutation } from '../../../generated/graphql';
import { useGlobalState } from '../../../state';

const TopNav: React.FC<Props> = () => {
  const [user, setUser] = useGlobalState('user');
  const [_, setModal] = useGlobalState('modal');

  const [logout] = useLogoutMutation({ refetchQueries: ['Me'] });

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
              {/* <!-- Icon when menu is closed. -->
            <!--
              Heroicon name: menu
  
              Menu open: "hidden", Menu closed: "block"
            --> */}
              <svg
                aria-hidden="true"
                className="block h-6 w-6"
                fill="none"
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
              {/* <!-- Icon when menu is open. -->
            <!--
              Heroicon name: x
  
              Menu open: "block", Menu closed: "hidden"
            --> */}
              <svg
                aria-hidden="true"
                className="hidden h-6 w-6"
                fill="none"
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
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img
                alt="Workflow"
                className="block lg:hidden h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
              />
              <img
                alt="Workflow"
                className="hidden lg:block h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
              />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                <a
                  className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="#"
                >
                  Dashboard
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="#"
                >
                  Team
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="#"
                >
                  Projects
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="#"
                >
                  Calendar
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user.data && user.data.me && !user.loading ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    aria-haspopup="true"
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    id="user-menu"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    />
                  </button>
                </div>
                {/* <!--
              Profile dropdown panel, show/hide based on dropdown state.
  
              Entering: "transition ease-out duration-100"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            --> */}
                <div
                  aria-labelledby="user-menu"
                  aria-orientation="vertical"
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  role="menu"
                >
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="#"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="#"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="#"
                    onClick={() => {
                      logout();
                      setUser({ data: undefined, loading: false });
                    }}
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </div>
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

      <div className="hidden sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
          <a
            className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            href="#"
          >
            Dashboard
          </a>
          <a
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="#"
          >
            Team
          </a>
          <a
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="#"
          >
            Projects
          </a>
          <a
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="#"
          >
            Calendar
          </a>
        </div>
      </div>
    </nav>
  );
};

type Props = {};

export default TopNav;
