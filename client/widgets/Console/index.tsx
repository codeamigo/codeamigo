import React, { useEffect, useRef, useState } from 'react';

import Icon from '../../components/Icon';
import { FromPreviewMsgType, PreviewLogTypeEnum } from '../Lesson/Editor/types';

const Console: React.FC<Props> = () => {
  const stackRef = useRef<HTMLDivElement>(null);
  const [stack, setStack] = useState<FromPreviewMsgType[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    const handleLog = (event: { data: FromPreviewMsgType }) => {
      if (event.data.from !== 'preview') return;
      if (!(event.data.type in PreviewLogTypeEnum)) return;

      setStack((currentStack) => [...currentStack, event.data]);
      if (stackRef.current) {
        stackRef.current.scrollTop = stackRef.current.scrollHeight;
      }
    };

    window.addEventListener('message', handleLog);

    return () => window.removeEventListener('message', handleLog);
  });

  return (
    <div
      className="overflow-hidden min-h-6 transition-all duration-500 bg-gray-700"
      style={{
        height: isActive ? '100%' : '0%',
      }}
    >
      <div className="bg-gray-900">
        <ul className="flex justify-between">
          <li
            className={`${
              isActive ? 'bg-gray-700' : ''
            } text-white text-xs px-4 py-1 list-none cursor-pointer`}
            onClick={() => setIsActive(!isActive)}
          >
            Console
          </li>
          <li className="flex list-none pr-2">
            <Icon
              className="text-gray-700 hover:text-gray-400 transition-colors duration-150"
              name="erase"
              onClick={() => setStack([])}
            />
          </li>
        </ul>
      </div>
      <div className="overflow-scroll h-full" ref={stackRef}>
        {stack.map((value, i) => {
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
        })}
      </div>
    </div>
  );
};

type Props = {};

export default Console;
