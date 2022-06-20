import React, { MouseEvent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Separator: React.FC<Props> = ({
  iframeName,
  maxDrag,
  onChangeX,
  onDragEnd,
}) => {
  const [xMove, setXMove] = useState(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const startDrag = (e: MouseEvent) => {
    let xStart = e.pageX;
    const iframe = document.getElementsByClassName(iframeName)[0];
    // @ts-ignore
    iframe.style.pointerEvents = 'none';
    setIsDragging(true);

    const onMouseMove = (e: any) => {
      setXMove(xStart - e.pageX);
    };

    const endDrag = (e: MouseEvent) => {
      xStart = e.pageX;
      // @ts-ignore
      iframe.style.pointerEvents = 'none';
      document.removeEventListener('mousemove', onMouseMove);
      setIsDragging(false);
      onDragEnd();
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
      className={`hidden md:block absolute right-0 top-0 h-full w-1 bg-bg-nav-offset-faded cursor-col-resize transition-all duration-200 hover:bg-bg-nav-offset ${
        isDragging ? 'opacity-50' : ''
      }`}
      onMouseDown={startDrag}
    />
  );
};

type Props = {
  iframeName: string;
  maxDrag: number | null;
  onChangeX: (x: number) => void;
  onDragEnd: () => void;
};

export default Separator;
