// WIP
import React, { MouseEvent } from 'react';
import { useState } from 'react';

const Separator: React.FC<Props> = () => {
  const [xMove, setXMove] = useState(0);

  const startDrag = (e: MouseEvent) => {
    const endDrag = (event: MouseEvent<Element, MouseEvent>) => {
      console.log(xMove - event.pageX);
    };

    // @ts-ignore
    window.removeEventListener('mouseup', endDrag);

    setXMove(e.pageX);

    // @ts-ignore
    window.addEventListener('mouseup', endDrag);
  };

  return (
    <div
      className="absolute right-0 top-0 h-full w-2 bg-bg-nav-offset cursor-col-resize"
      onMouseDown={startDrag}
    />
  );
};

type Props = {};

export default Separator;
