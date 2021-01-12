import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { RegularStepFragment, useCheckpointsQuery } from '👨‍💻generated/graphql';
import TestSummary from '👨‍💻widgets/Console/TestsSummary';

import { FromPreviewMsgType, PreviewLogTypeEnum } from '../Lesson/Editor/types';

type TabType = 'console' | 'tests';

const Console: React.FC<Props> = ({ step }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { data, loading } = useCheckpointsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { stepId: step.id },
  });
  const [logList, setLogList] = useState<FromPreviewMsgType[]>([]);
  const [testList, setTestList] = useState<FromPreviewMsgType[]>([]);
  const [activeTab, setActiveTab] = useState<TabType | ''>('');
  const currentCheck = data?.checkpoints.find(
    ({ id }) => id === step.currentCheckpointId
  );

  useEffect(() => {
    const handleLog = (event: { data: FromPreviewMsgType }) => {
      if (event.data.from !== 'preview') return;
      if (!(event.data.type in PreviewLogTypeEnum)) return;

      if (event.data.type === 'test') {
        setTestList([event.data]);
      } else {
        setLogList((currentList) => [...currentList, event.data]);
      }
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    };

    window.addEventListener('message', handleLog);

    return () => window.removeEventListener('message', handleLog);
  });

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

  const list = activeTab === 'console' ? logList : testList;

  return (
    <div
      className="flex flex-col overflow-hidden min-h-6 transition-all duration-500 bg-gray-700"
      style={{
        height: activeTab ? '100%' : '0%',
      }}
    >
      <div className="bg-gray-900">
        <div className="flex justify-between">
          <ul className="flex justify-between">
            <li
              className={`${
                activeTab === 'console' ? 'bg-gray-700' : ''
              } text-white text-xs px-4 py-1 list-none cursor-pointer transition-all duration-150`}
              onClick={() => changeTab('console')}
              role="button"
            >
              Console
            </li>
            <li
              className={`${
                activeTab === 'tests' ? 'bg-gray-700' : ''
              } text-white text-xs px-4 py-1 list-none cursor-pointer transition-all duration-150`}
              onClick={() => changeTab('tests')}
              role="button"
            >
              Tests
            </li>
          </ul>
          <div className="flex list-none pr-2">
            <Icon
              className="text-gray-700 hover:text-gray-400 transition-colors duration-300"
              name="erase"
              onClick={() => resetList()}
            />
          </div>
        </div>
      </div>
      <div className="overflow-scroll h-full" ref={listRef}>
        {activeTab === 'tests' ? (
          <TestSummary checkpoint={currentCheck} list={list} />
        ) : (
          list.map((value, i) => {
            return (
              <div
                className="bg-gray-700 border-black border-b text-white text-xs"
                key={i}
              >
                <div className="px-2 py-1 flex items-start">
                  <span className="mr-3">{'>'}</span> {value.result}
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
