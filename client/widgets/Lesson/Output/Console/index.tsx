import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { RegularStepFragment, useCheckpointsQuery } from '👨‍💻generated/graphql';
import {
  FromPreviewMsgType,
  FromTestRunnerMsgType,
  PreviewLogTypeEnum,
} from '👨‍💻widgets/Lesson/EditorV2/types';
import TestSummary from '👨‍💻widgets/Lesson/Output/Console/TestsSummary';

type TabType = 'console' | 'tests';

const Console: React.FC<Props> = ({ step }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { data } = useCheckpointsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { stepId: step.id },
  });
  const [logList, setLogList] = useState<FromPreviewMsgType[]>([]);
  const [testList, setTestList] = useState<FromTestRunnerMsgType[]>([]);
  const [activeTab, setActiveTab] = useState<TabType | ''>('');
  const currentCheck = data?.checkpoints.find(
    ({ id }) => id === step.currentCheckpointId
  );

  useEffect(() => {
    const handleLog = (event: { data: FromPreviewMsgType }) => {
      if (event.data.from !== 'preview') return;
      if (!(event.data.type in PreviewLogTypeEnum)) return;

      setLogList((currentList) => [...currentList, event.data]);
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    };

    const handleTest = (event: { data: FromTestRunnerMsgType }) => {
      if (event.data.from !== 'testRunner') return;
      if (!(event.data.type in PreviewLogTypeEnum)) return;

      setTestList([event.data]);
    };

    window.addEventListener('message', handleLog);
    window.addEventListener('message', handleTest);

    return () => {
      window.removeEventListener('message', handleLog);
      window.removeEventListener('message', handleTest);
    };
  }, [step.currentCheckpointId]);

  useEffect(() => {
    setTestList([]);
  }, [step.currentCheckpointId]);

  const changeTab = (tab: 'console' | 'tests') => {
    if (tab === activeTab) {
      setActiveTab('');
    } else {
      setActiveTab(tab);
    }
  };

  const resetList = () => {
    if (activeTab === 'console') {
      setLogList([]);
    } else {
      setTestList([]);
    }
  };

  const list = activeTab === 'tests' ? testList : logList;
  const testFailure = testList.filter((value) => {
    try {
      return JSON.parse(value.result).some(
        ({ status }: { status: string }) => status === 'fail'
      );
    } catch (e) {
      return false;
    }
  }).length;

  return (
    <div
      className="flex flex-col overflow-hidden min-h-16 transition-all duration-500 bg-bg-nav border-t border-bg-nav-offset"
      style={{
        height: activeTab ? '100%' : '0%',
      }}
    >
      <div className="bg-bg-nav">
        <div className="flex justify-between">
          <ul className="flex justify-between">
            <li
              className={`${
                activeTab === 'console' ? 'text-accent' : 'text-text-primary'
              } font-semibold text-sm px-4 py-5 list-none cursor-pointer transition-all duration-150 border-r border-accent`}
              onClick={() => changeTab('console')}
              role="button"
            >
              Console
            </li>
            <li
              className={`${
                activeTab === 'tests' ? 'text-accent' : 'text-text-primary'
              } flex align-center font-semibold text-sm px-4 py-5 list-none cursor-pointer transition-all duration-150`}
              onClick={() => changeTab('tests')}
              role="button"
            >
              Tests
              {testFailure ? (
                <Icon className="ml-2 text-red-600" name="cancel-circled" />
              ) : null}
            </li>
          </ul>
          <div className="flex list-none pr-2">
            <Icon
              className="text-text-primary hover:text-gray-400 transition-colors duration-300"
              name="erase"
              onClick={() => resetList()}
            />
          </div>
        </div>
      </div>
      <div
        className={`overflow-scroll h-full ${
          activeTab ? 'border-t border-accent' : ''
        }`}
        ref={listRef}
      >
        {activeTab === 'tests' ? (
          <TestSummary
            checkpoint={currentCheck}
            list={list as FromTestRunnerMsgType[]}
          />
        ) : (
          (list as FromPreviewMsgType[]).map((value, i) => {
            console.log(value);
            return (
              <div
                className={`border-bg-nav-offset border-b text-xs ${
                  value.type === 'error'
                    ? 'bg-red-900 text-red-100'
                    : value.type === 'warn'
                    ? 'bg-yellow-900 text-yellow-100'
                    : 'bg-bg-nav text-text-primary'
                }`}
                key={i}
              >
                <div className="px-2 py-1 flex items-start">
                  <div className="flex items-center">
                    {value.type === 'error' && <span className="w-5">⛔️</span>}
                    {value.type === 'warn' && (
                      <span className="w-5 text-yellow-100">⚠️</span>
                    )}
                    {value.type === 'log' && <span className="w-5">{'>'}</span>}
                  </div>{' '}
                  <div>{value.result}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Console;
