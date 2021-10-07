import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import { Icon as LogoIcon, Logo } from '👨‍💻components/Logos';
import UserMenu from '👨‍💻widgets/UserMenu';

import styles from './TopNav.module.scss';

const TopNav: React.FC<Props> = () => {
  const router = useRouter();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-bg-nav border-b border-bg-nav-offset-faded">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              aria-expanded="false"
              className="inline-flex items-center justify-center p-2 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
          <div className="h-full flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex space-x-4">
              <button
                className={`flex items-center font-bold text-xl text-text-primary focus:outline-none`}
                onClick={() => router.push('/')}
              >
                <Logo className="sm:w-12 w-8 sm:mr-1.5 sm:text-lg text-xs" />
                <span className="text-sm sm:text-lg">Codeamigo</span>
              </button>
            </div>
          </div>
          <div className="hidden sm:block">
            <Button
              onClick={() =>
                modalVar({ callback: () => null, name: 'createLesson' })
              }
            >
              <Icon className="mr-1.5" name="plus-circled" />
              <span>New Lesson</span>
            </Button>
          </div>
          <UserMenu />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Button
              onClick={() =>
                modalVar({ callback: () => null, name: 'createLesson' })
              }
            >
              <Icon className="mr-1.5" name="plus-circled" />
              <span>New Lesson</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

type Props = {};

export default TopNav;
