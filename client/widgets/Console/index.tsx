import React, { useEffect, useState } from 'react';

import Icon from '../../components/Icon';
import { FromPreviewMsgType, PreviewLogTypeEnum } from '../Lesson/Editor/types';

const Console: React.FC<Props> = () => {
  const [stack, setStack] = useState<FromPreviewMsgType[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    const handleLog = (event: { data: FromPreviewMsgType }) => {
      if (event.data.from !== 'preview') return;
      if (!(event.data.type in PreviewLogTypeEnum)) return;

      setStack((currentStack) => [...currentStack, event.data]);
    };

    window.addEventListener('message', handleLog);

    return () => window.removeEventListener('message', handleLog);
  });

  return (
    <div
      className={`h-${isActive ? 'full max-h-full' : '0'} ${
        isActive ? 'overflow-scroll' : 'overflow-hidden'
      } max-h-6 min-h-6 transition-height duration-500 delay-75 bg-gray-700`}
    >
      <div className="bg-gray-900 sticky top-0">
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
  );
};

type Props = {};

export default Console;
