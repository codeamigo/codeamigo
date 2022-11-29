import React from 'react';

import { Logo } from '👨‍💻components/Logos';

const Footer: React.FC<Props> = () => {
  return (
    <div className="text-text-primary bg-bg-nav">
      <div className="py-3 px-2 sm:px-6 lg:px-8 mx-auto w-full max-w-7xl">
        <div className="flex items-center text-lg font-bold">
          <Logo className="mr-1 sm:mr-1.5 w-8 sm:w-12" />{' '}
          <div className="text-sm md:text-lg">
            Byte-sized interactive coding tutorials
          </div>
        </div>
        <div className="flex gap-2 mt-3 text-xs sm:text-sm font-semibold">
          {/* <div
            aria-label="No landing page.&#10;-&#10;No signup required.&#10;-&#10;Nothing to buy.&#10;-&#10;codeamigo allows anyone to take&#10;free interactive coding tutorials.&#10;Built by the community."
            className="hint--top-right hint--no-animate"
          >
            About
          </div>
          &#183; */}
          <div>
            <a href="https://docs.codeamigo.dev" target="_blank">
              Docs
            </a>
          </div>
          &#183;
          <div>
            <a href="https://docs.codeamigo.dev/blog" target="_blank">
              Blog
            </a>
          </div>
          &#183;
          <div>
            <a href="https://github.com/codeamigo" target="_blank">
              GitHub
            </a>
          </div>
          &#183;
          <div>
            <a href="https://twitter.com/codeamigo_dev" target="_blank">
              Twitter
            </a>
          </div>
          &#183;
          <div>
            <a href="https://discord.gg/n64Ann2zRc" target="_blank">
              Discord
            </a>
          </div>
        </div>
        <div className="mt-4 text-xxs sm:text-xs">
          Copyright &#169; 2021, codeamigo, LLC
        </div>
      </div>
    </div>
  );
};

type Props = {};

export default Footer;
