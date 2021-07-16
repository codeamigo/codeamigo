import React, { MouseEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Separator: React.FC<Props> = () => {
  const [xMove, setXMove] = useState(0);

  const startDrag = (e: MouseEvent) => {
    const iframe = document.getElementsByClassName('sp-preview-iframe')[0];
    // @ts-ignore
    iframe.style.pointerEvents = 'none';

    const onMouseMove = (e) => {
      console.log(e);
    };

    const endDrag = (event: MouseEvent<Element, MouseEvent>) => {
      // @ts-ignore
      iframe.style.pointerEvents = 'auto';
      document.removeEventListener('mousemove', onMouseMove);
    };

    // @ts-ignore
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('mousemove', onMouseMove);

    setXMove(e.pageX);

    // @ts-ignore
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mousemove', onMouseMove);
  };

  useEffect(() => {
    console.log(xMove);
  }, [xMove]);

  return (
    <div
      className="hidden md:block absolute right-0 top-0 h-full w-2 bg-bg-nav-offset cursor-col-resize"
      onMouseDown={startDrag}
    />
  );
};

type Props = {};

export default Separator;
