import React from 'react';

import EditingLessonsList from '👨‍💻widgets/UserLessonsList/EditingLessonsList';
import PendingApprovalLessonsList from '👨‍💻widgets/UserLessonsList/PendingApprovalLessonsList';
import PublishedLessonsList from '👨‍💻widgets/UserLessonsList/PublishedLessonsList';

const UserLessonsList: React.FC<Props> = () => {
  return (
    <div>
      <EditingLessonsList />
      <PendingApprovalLessonsList />
      <PublishedLessonsList />
    </div>
  );
};

type Props = {};

export default UserLessonsList;
