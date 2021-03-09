import React from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import Label from '👨‍💻widgets/Lesson/Info/LessonOptions/Label';

const LessonOptions: React.FC<Props> = ({ setShowOptions, showOptions }) => {
  return (
    <div className="flex items-center">
      <Icon
        className="text-text-primary mr-2"
        name="list-add"
        onClick={() => setShowOptions(!showOptions)}
      />
      <Button className="py-1" disabled>
        Publish
      </Button>
    </div>
  );
};

export const Options: React.FC = () => {
  return (
    <div className="flex justify-end w-full py-2 px-4 bg-bg-primary border-b border-bg-nav-offset absolute z-10 shadow-lg">
      <Label />
    </div>
  );
};

type Props = {
  setShowOptions: (val: boolean) => void;
  showOptions: boolean;
};

export default LessonOptions;
