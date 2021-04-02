import React, { useEffect, useState } from 'react';

/* eslint-disable */
const statusMap: { [key in string]: string } = {
  '': '0%',
  'Symbol(READY)': '10%',
  'Symbol(BUNDLING_RUNNING)': '33%',
  'Symbol(BUNDLING_FINISHED)': '100%',
};
/* eslint-enable */

const Preview: React.FC<Props> = () => {
  const [bundlerState, setBundlerState] = useState('');
  const [bundlerStateVisible, setBundlerStateVisible] = useState(true);

  useEffect(() => {
    const handleBundlerMessages = (e: MessageEvent) => {
      if (e.data.from === 'bundler') {
        setBundlerState(e.data.bundlingState);
      }
    };

    window.addEventListener('message', handleBundlerMessages);
    return () => window.removeEventListener('message', handleBundlerMessages);
  }, []);

  useEffect(() => {
    if (bundlerState === 'Symbol(BUNDLING_FINISHED)') {
      const timeout = setTimeout(() => {
        // hide progress bar
        setBundlerStateVisible(false);
        setBundlerState('');
        // reveal progress bar
        setTimeout(() => {
          setBundlerStateVisible(true);
        }, 201);
      }, 201);

      return () => clearTimeout(timeout);
    }
  }, [bundlerState]);

  const width =
    typeof bundlerState === 'string'
      ? statusMap[(bundlerState as unknown) as string]
      : '33%' || '33%';

  return (
    <>
      <div className="p-2">
        <div className="relative w-full rounded-xl overflow-hidden px-2 py-1 text-xs text-text-primary cursor-text">
          <div
            className={`${
              bundlerStateVisible ? '' : 'hidden'
            } absolute bg-accent h-full top-0 left-0 transition-width transition-all duration-200`}
            style={{ width }}
          ></div>
          <div className="absolute bg-bg-nav-offset h-full w-full top-0 left-0 opacity-50"></div>
          <div className="z-10 relative font-semibold">
            {process.env.NEXT_PUBLIC_PREVIEW_URL}
          </div>
        </div>
      </div>
      <iframe
        className="w-full h-full"
        id="frame"
        src={process.env.NEXT_PUBLIC_PREVIEW_URL}
      ></iframe>
    </>
  );
};

type Props = {};

export default Preview;
