import React from 'react';

import Icon from '👨‍💻components/Icon';
import { useUpdateProfileColorSchemeMutation } from '👨‍💻generated/graphql';
import ProfileLogo from '👨‍💻widgets/ProfileLogo';

const EditProfilePic: React.FC<Props> = () => {
  const [updateProfileColorScheme] = useUpdateProfileColorSchemeMutation();

  return (
    <div className="h-40 w-40 bg-bg-nav border border-bg-nav-offset mb-4 rounded-full relative">
      <ProfileLogo />
      <div className="absolute h-3/4 w-full top-0 left-0"></div>
      <div className="absolute w-8 h-8 rounded-full border border-bg-nav-offset bg-bg-nav bottom-1 right-1 flex justify-center">
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
