import React, { MouseEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Separator: React.FC<Props> = ({ onChangeX }) => {
  const [xMove, setXMove] = useState(0);
  const [xStart, setXStart] = useState(0);

  const startDrag = (e: MouseEvent) => {
    setXStart(e.pageX);
    const iframe = document.getElementsByClassName('sp-preview-iframe')[0];
    // @ts-ignore
    iframe.style.pointerEvents = 'none';

    const onMouseMove = (e: any) => {
      setXMove(xStart - e.pageX);
    };

    const endDrag = () => {
      // @ts-ignore
      iframe.style.pointerEvents = 'auto';
      document.removeEventListener('mousemove', onMouseMove);
    };

    // @ts-ignore
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('mousemove', onMouseMove);

    // @ts-ignore
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mousemove', onMouseMove);
  };

  useEffect(() => {
    onChangeX(xMove);
  }, [xMove]);

  return (
    <div
      className="hidden md:block absolute right-0 top-0 h-full w-4 bg-bg-nav cursor-col-resize"
      onMouseDown={startDrag}
    />
  );
};

type Props = {
  onChangeX: (x: number) => void;
};

export default Separator;
