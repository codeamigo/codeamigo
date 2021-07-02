import React from 'react';

import ChangeEmail from '👨‍💻widgets/Settings/ChangeEmail';
import ChangePassword from '👨‍💻widgets/Settings/ChangePassword';
import DeleteUser from '👨‍💻widgets/Settings/DeleteUser';

const Settings: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-6">
      <ChangePassword />
      <ChangeEmail />
      <DeleteUser />
    </div>
  );
};

type Props = {};

export default Settings;
