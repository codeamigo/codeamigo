import React from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  LessonQuery,
  useUpdateLessonStatusMutation,
} from '👨‍💻generated/graphql';
import Label from '👨‍💻widgets/Lesson/Info/LessonOptions/Label';
import Thumbnail from '👨‍💻widgets/Lesson/Info/LessonOptions/Thumbnail';

const LessonOptions: React.FC<Props> = ({
  lesson,
  setShowOptions,
  showOptions,
}) => {
  if (!lesson) return null;
  const [updateLessonStatusM] = useUpdateLessonStatusMutation();

  const publishLesson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    await updateLessonStatusM({
      variables: { id, status: 'PENDING_PUBLISH' },
    });
  };

  return (
    <div className="flex items-center">
      <Icon
        className="text-text-primary mr-2"
        name="list-add"
        onClick={() => setShowOptions(!showOptions)}
      />
      {lesson.status === 'PENDING_PUBLISH' ? (
        <Button className="py-1" disabled>
          Awaiting Approval
        </Button>
      ) : (
        <Button className="py-1" onClick={(e) => publishLesson(e, lesson.id)}>
          Publish
        </Button>
      )}
    </div>
  );
};

export const Options: React.FC<OptionsProps> = (props) => {
  return (
    <div className="flex justify-end w-full gap-6 py-2 pr-16 px-4 bg-bg-primary border-b border-bg-nav-offset absolute z-20 shadow-lg">
      <Thumbnail {...props} />
      <Label {...props} />
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
  setShowOptions: (val: boolean) => void;
  showOptions: boolean;
};

type OptionsProps = {
  lesson: LessonQuery['lesson'];
};

export default LessonOptions;
