import React from 'react';

import ChangeEmail from '👨‍💻widgets/Settings/ChangeEmail';
import ChangePassword from '👨‍💻widgets/Settings/ChangePassword';

const Settings: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-6">
      <ChangePassword />
      <ChangeEmail />
    </div>
  );
};

type Props = {};

export default Settings;
