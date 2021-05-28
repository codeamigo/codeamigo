import { Console as ConsoleFeed, Decode } from 'console-feed';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';

import Tests from '👨‍💻widgets/Lesson/Console/Tests';

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
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');

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
      className="bg-bg-primary h-full flex flex-col border-l border-bg-nav-offset overflow-scroll"
      style={{ backgroundColor: '#242424' }}
    >
      <div className="bg-bg-primary border-b border-bg-nav-offset flex sticky top-0 z-10">
        <div
          className={`px-4 py-2 text-text-primary text-xs cursor-pointer ${
            activeTab === 'console' ? 'bg-bg-nav-offset' : ''
          }`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </div>
        <div
          className={`px-4 py-2 text-text-primary text-xs cursor-pointer ${
            activeTab === 'tests' ? 'bg-bg-nav-offset' : ''
          }`}
          onClick={() => setActiveTab('tests')}
        >
          Tests
        </div>
      </div>
      <div>
        <div
          className={`${activeTab === 'console' ? 'block' : 'hidden'}`}
          ref={listRef}
        >
          <consoleFeed.Console
            logs={logList}
            styles={{
              BASE_FONT_SIZE: '13px',
              LOG_RESULT_BACKGROUND: 'blue',
            }}
            variant="dark"
          />
        </div>
        <div className={`${activeTab === 'tests' ? 'block' : 'hidden'}`}>
          <Tests />
        </div>
      </div>
    </div>
  );
};

type Props = {};

export default Console;
