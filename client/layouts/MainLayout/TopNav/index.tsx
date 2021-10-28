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
    <nav className="border-b bg-bg-nav border-bg-nav-offset-faded">
      <div className="px-2 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="flex relative justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex sm:hidden inset-y-0 left-0 items-center">
              {/* <!-- Mobile menu button--> */}
              <button
                aria-expanded="false"
                className="inline-flex justify-center items-center p-2 rounded-md focus:ring-2 focus:ring-inset focus:ring-white focus:outline-none text-text-primary"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
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
                    className="block w-6 h-6"
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
            <div className="h-full">
              <div className="flex space-x-4">
                <button
                  className={`flex items-center font-bold text-xl text-text-primary focus:outline-none`}
                  onClick={() => router.push('/')}
                >
                  <Logo className="mr-1 sm:mr-1.5 w-8 sm:w-12 text-xs sm:text-lg" />
                  <span className="text-base sm:text-lg">Codeamigo</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center">
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
