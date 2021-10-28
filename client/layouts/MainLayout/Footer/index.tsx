import React from 'react';

const Footer: React.FC<Props> = () => {
  return (
    <div className="bg-bg-nav text-text-primary">
      <div className="py-3 px-2 sm:px-6 lg:px-8 mx-auto w-full max-w-7xl">
        <div className="text-lg font-bold">
          Byte-sized interactive coding tutorials
        </div>
        <div className="flex gap-2 mt-3 text-xs">
          <div
            aria-label="No landing page.&#10;No signup required.&#10;Nothing to buy.&#10;Codeamigo.dev allows anyone to take&#10;free interactive coding tutorials.&#10;Built by the community."
            className="hint--top hint--no-animate"
          >
            About
          </div>
          &#183;
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
            <a href="https://discord.gg/n64Ann2zRc" target="_blank">
              Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {};

export default Footer;
