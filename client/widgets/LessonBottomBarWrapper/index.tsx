import React from 'react';

const LessonBottomBarWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex justify-between items-center px-3 w-full h-16 border-t min-h-16 bg-bg-nav border-bg-nav-offset-faded">
      {children}
    </div>
  );
};

type Props = {};

export default LessonBottomBarWrapper;
