import React from 'react';

import Button from '👨‍💻components/Button';

const LessonOptions: React.FC<Props> = () => {
  return (
    <div>
      <Button className="py-1" disabled>
        Publish
      </Button>
    </div>
  );
};

type Props = {};

export default LessonOptions;
