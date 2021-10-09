import React from 'react';

import Icon from '👨‍💻components/Icon';
import { useUpdateProfileColorSchemeMutation } from '👨‍💻generated/graphql';
import ProfileLogo from '👨‍💻widgets/ProfileLogo';

const EditProfilePic: React.FC<Props> = () => {
  const [updateProfileColorScheme] = useUpdateProfileColorSchemeMutation();

  return (
    <div className="relative mb-4 w-40 h-40 bg-bg-nav rounded-full border border-bg-nav-offset">
      <ProfileLogo />
      <div className="absolute top-0 left-0 w-full h-3/4"></div>
      <div className="flex absolute right-1 bottom-1 justify-center w-8 h-8 bg-bg-nav rounded-full border border-bg-nav-offset">
        <Icon
          className="text-text-primary"
          name="arrows-ccw"
          onClick={() =>
            updateProfileColorScheme({ refetchQueries: ['ProfileColorScheme'] })
          }
        />
      </div>
    </div>
  );
};

type Props = {};

export default EditProfilePic;
