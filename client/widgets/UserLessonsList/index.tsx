import React from 'react';

import EdittingLessonsList from '👨‍💻widgets/UserLessonsList/EdittingLessonsList';
import PendingApprovalLessonsList from '👨‍💻widgets/UserLessonsList/PendingApprovalLessonsList';
import PublishedLessonsList from '👨‍💻widgets/UserLessonsList/PublishedLessonsList';

const UserLessonsList: React.FC<Props> = () => {
  return (
    <div>
      <EdittingLessonsList />
      <PendingApprovalLessonsList />
      <PublishedLessonsList />
    </div>
  );
};

type Props = {};

export default UserLessonsList;
