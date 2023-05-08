import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Icon from '👨‍💻components/Icon';

const Instructions: React.FC<Props> = ({
  instructions,
  leftPanelHeight,
  setLeftPanelHeight,
}: Props) => {
  const [full, setFull] = useState(false);

  useEffect(() => {
    setLeftPanelHeight({
      editor: full ? '0px' : 'calc(100% - 18rem)',
      instructions: full ? '100%' : '18rem',
    });
  }, [full]);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-900 transition-all ${
        full ? 'z-40' : 'z-20'
      }`}
      style={{ height: `${leftPanelHeight.instructions}` }}
    >
      <ReactMarkdown
        children={instructions as string}
        className="markdown-body h-full overflow-scroll border-b border-neutral-800 px-3 py-2"
        plugins={[gfm]}
      />
      <Icon
        className="absolute bottom-0 right-0 m-2 text-neutral-400 hover:text-white"
        name={full ? 'resize-small' : 'resize-full'}
        onClick={() => setFull(!full)}
      />
    </div>
  );
};

type Props = {
  instructions: string;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  setLeftPanelHeight: Dispatch<
    SetStateAction<{
      editor: string;
      instructions: string;
    }>
  >;
};

export default Instructions;
