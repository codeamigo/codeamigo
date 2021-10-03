import { useReactiveVar } from '@apollo/client';
import { Console as ConsoleFeed, Decode } from 'console-feed';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { DEFAULT_THEME } from 'styles/appThemes';
import * as themes from 'styles/monacoThemes';

import { testFailureVar } from '👨‍💻apollo/cache/lesson';
import Icon from '👨‍💻components/Icon';
import { IconType } from '👨‍💻components/Icon/types';
import { Theme, useMeQuery } from '👨‍💻generated/graphql';
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

const Console: React.FC<Props> = (props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [logList, setLogList] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>(
    props.tabs[0]
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const testFailure = useReactiveVar(testFailureVar);

  const { data } = useMeQuery();

  useEffect(() => {
    const handleLogs = (msg: MessageEvent<SandpackLogMessageType>) => {
      if (msg.data.type === 'console') {
        setLogList((currentList: any) => [
          ...currentList,
          consoleFeed.Decode(msg.data.log),
        ]);
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight + 24;
        }
      }
    };

    window.addEventListener('message', handleLogs);

    return () => window.removeEventListener('message', handleLogs);
  }, []);

  useEffect(() => {
    if (testFailure) {
      setActiveTab('tests');
    }
  }, [testFailure]);

  // @ts-ignore
  const { base } = themes[data?.me?.theme || DEFAULT_THEME];

  return (
    <div
      className={`bg-bg-primary flex flex-col overflow-scroll ${
        isCollapsed ? 'h-8' : 'h-1/2'
      }`}
      ref={listRef}
      style={{
        backgroundColor:
          activeTab === 'tests' ? 'var(--bg-primary)' : '#242424',
      }}
    >
      <div className="bg-bg-primary border-b border-t border-bg-nav-offset-faded flex justify-between sticky top-0 z-10">
        <div className="flex">
          {props.tabs.map((tab) => {
            return (
              <div
                className={`px-4 py-2 text-text-primary text-xs cursor-pointer capitalize ${
                  activeTab === tab ? 'bg-bg-nav' : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            );
          })}
        </div>
        <div className={`flex items-center pr-1`}>
          <div className="px-4">
            <Icon
              className="text-text-primary opacity-50 hover:opacity-100 transition-all"
              name={`${isCollapsed ? 'up' : 'down'}` as IconType}
              onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
            />
          </div>
          <div className={`px-4 ${activeTab === 'console' ? '' : 'hidden'}`}>
            <Icon
              className="text-text-primary opacity-50 hover:opacity-100 transition-all"
              name="trash"
              onClick={() => setLogList([])}
            />
          </div>
        </div>
      </div>
      <div className={`${activeTab === 'console' ? 'block' : 'hidden'}`}>
        <consoleFeed.Console
          logs={logList}
          styles={{
            BASE_FONT_SIZE: '13px',
            LOG_RESULT_BACKGROUND: 'blue',
          }}
          variant={'dark'}
        />
      </div>
      <div className={`${activeTab === 'tests' ? 'block' : 'hidden'}`}>
        <Tests />
      </div>
    </div>
  );
};

type Props = {
  tabs: ('console' | 'tests')[];
};

export default Console;
