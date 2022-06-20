import React from 'react';

const LessonBottomBarWrapper: React.FC<Props> = ({ children, padding }) => {
  return (
    <div
      className={`flex justify-between items-center w-full h-16 border-t border-b min-h-16 bg-bg-nav border-bg-nav-offset-faded ${
        padding ? 'px-3' : ''
      }`}
    >
      {children}
    </div>
  );
};

type Props = {
  padding: boolean;
};

export default LessonBottomBarWrapper;
