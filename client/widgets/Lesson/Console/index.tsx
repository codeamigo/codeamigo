import { Console as ConsoleFeed, Decode } from 'console-feed';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';

let consoleFeed: { Console: typeof ConsoleFeed; Decode: typeof Decode };

if (typeof window !== 'undefined') {
  consoleFeed = require('console-feed');
}

type SandpackLogMessageType = {
  $id: number;
  codesandbox: boolean;
  log: {
    data: string[];
    id: string;
    method: 'info' | 'log' | 'error' | 'warning';
  };
  type: 'console';
};

const Console: React.FC<Props> = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [logList, setLogList] = useState<any>([]);

  useEffect(() => {
    const handleLogs = (msg: MessageEvent<SandpackLogMessageType>) => {
      if (msg.data.type === 'console') {
        setLogList((currentList: any) => [
          ...currentList,
          consoleFeed.Decode(msg.data.log),
        ]);
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }
    };

    window.addEventListener('message', handleLogs);

    return () => window.removeEventListener('message', handleLogs);
  }, []);

  return (
    <div
      className="bg-bg-primary flex flex-col border-l border-bg-nav-offset h-full"
      style={{ backgroundColor: '#242424' }}
    >
      <div className="bg-bg-primary border-b border-bg-nav-offset flex sticky top-0">
        <div className="px-4 py-2 text-text-primary text-xs cursor-pointer">
          Console
        </div>
      </div>
      <div ref={listRef}>
        <consoleFeed.Console
          logs={logList}
          styles={{
            BASE_FONT_SIZE: '13px',
            LOG_RESULT_BACKGROUND: 'blue',
          }}
          variant="dark"
        />
      </div>
    </div>
  );
};

type Props = {};

export default Console;
