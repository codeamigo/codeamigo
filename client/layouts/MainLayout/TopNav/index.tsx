import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import { Logo } from '👨‍💻components/Logos';
import UserMenu from '👨‍💻widgets/UserMenu';

const TopNav: React.FC<Props> = () => {
  const router = useRouter();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-50">
      <div>
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="h-full">
              <div className="flex space-x-4">
                <button
                  className={`text-text-primary flex items-center text-xl font-bold focus:outline-none`}
                  onClick={() => router.push('/')}
                >
                  <Logo className="mr-1 w-8 text-xs sm:mr-1.5 sm:w-12 sm:text-lg" />
                  <span className="text-base sm:text-lg">codeamigo</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div>
              <Button
                onClick={() =>
                  window.open('https://forms.gle/weRYdVmr2LszmQiK6', '_blank')
                }
              >
                <Icon className="mr-1.5" name="plus-circled" />
                <span>Join Waitlist</span>
              </Button>
            </div>
            <Link href="/v2">
              <Button>
                <Icon className="mr-1.5" name="eye" />
                <span>Demo</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

type Props = {};

export default TopNav;
