import React from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  LessonQuery,
  useLessonQuery,
  useUpdateLessonStatusMutation,
} from '👨‍💻generated/graphql';
import Label from '👨‍💻widgets/Lesson/Info/LessonOptions/Label';
import Thumbnail from '👨‍💻widgets/Lesson/Info/LessonOptions/Thumbnail';

const LessonOptions: React.FC<Props> = ({
  lessonId,
  setShowOptions,
  showOptions,
}) => {
  const { data } = useLessonQuery({
    variables: { id: lessonId },
  });
  const [updateLessonStatusM] = useUpdateLessonStatusMutation();
  const lesson = data?.lesson;

  if (!lesson) return null;

  let disabledMessage;
  if (!lesson.label) {
    disabledMessage = 'A label is required.';
  }
  if (!lesson.thumbnail) {
    disabledMessage = 'A thumbnail (jpg, png, gif) is required.';
  }

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
        className="mr-2 text-text-primary"
        name="list-add"
        onClick={() => setShowOptions(!showOptions)}
      />
      {lesson.status === 'PENDING_PUBLISH' ? (
        <Button className="py-1" disabled>
          Awaiting Approval
        </Button>
      ) : (
        <div
          aria-label={disabledMessage}
          className={`${
            !!disabledMessage ? 'hint--no-animate hint--bottom-left' : ''
          }`}
        >
          <Button
            className="py-1"
            disabled={!!disabledMessage}
            onClick={(e) => publishLesson(e, lesson.id)}
          >
            Publish
          </Button>
        </div>
      )}
    </div>
  );
};

export const Options: React.FC<OptionsProps> = (props) => {
  return (
    <div className="flex absolute z-20 gap-6 justify-end py-2 px-4 pr-16 w-full bg-bg-primary border-b border-bg-nav-offset shadow-lg">
      <Thumbnail {...props} />
      <Label {...props} />
    </div>
  );
};

type Props = {
  lessonId: number;
  setShowOptions: (val: boolean) => void;
  showOptions: boolean;
};

type OptionsProps = {
  lesson: LessonQuery['lesson'];
};

export default LessonOptions;
