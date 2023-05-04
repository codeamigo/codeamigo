import TopNav from 'layouts/MainLayout/TopNav';
import React from 'react';

import Container from './Container';

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-between px-4 sm:px-8 md:max-w-7xl">
      <TopNav />
      <Container>{children}</Container>
      <footer className="animate-footer-slide-up-fade flex w-full items-end justify-between py-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-end gap-4">
            <a
              aria-label="GitHub"
              className="text-neutral-600 transition duration-200 ease-in-out hover:text-neutral-800"
              href="https://github.com/codeamigo"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
            <a
              aria-label="Twitter"
              className="text-neutral-600 transition duration-200 ease-in-out hover:text-neutral-800"
              href="https://twitter.com/codeamigo_dev"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.73557 21.5C16.4127 21.5 21.16 14.1894 21.16 7.85156C21.16 7.64604 21.1555 7.43595 21.1465 7.23043C22.07 6.55142 22.867 5.71038 23.5 4.74682C22.6399 5.13587 21.7267 5.38995 20.7917 5.5004C21.7762 4.90038 22.5134 3.95779 22.8666 2.84735C21.9404 3.40543 20.9274 3.79911 19.8712 4.01151C19.1596 3.24272 18.2186 2.73369 17.1939 2.56312C16.1691 2.39255 15.1176 2.56994 14.202 3.06786C13.2864 3.56579 12.5576 4.35651 12.1283 5.31779C11.699 6.27906 11.5931 7.35734 11.827 8.38592C9.95155 8.29023 8.11677 7.7949 6.44165 6.93203C4.76653 6.06916 3.28846 4.85803 2.10326 3.37713C1.50088 4.43303 1.31655 5.68251 1.58774 6.87162C1.85892 8.06072 2.56527 9.10024 3.56322 9.77889C2.81402 9.75471 2.08123 9.54963 1.42539 9.1806V9.23997C1.42472 10.3481 1.80151 11.4222 2.49171 12.2798C3.18192 13.1374 4.14293 13.7255 5.21141 13.9441C4.51739 14.1372 3.78898 14.1653 3.08256 14.0263C3.38406 14.9793 3.97067 15.8128 4.76053 16.4105C5.55039 17.0082 6.50407 17.3402 7.4885 17.3603C5.81724 18.695 3.75275 19.419 1.62754 19.4156C1.25065 19.415 0.874132 19.3915 0.5 19.3452C2.65899 20.7534 5.17047 21.5014 7.73557 21.5Z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
          </div>
          <div className="text-xs text-neutral-600">
            Made with{' '}
            <span aria-label="heart" role="img">
              ❤️
            </span>{' '}
            in{' '}
            <span aria-label="new york city" role="img">
              🗽
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
};

type Props = {};

export default MainLayout;
