import Image from 'next/image';
import React, { PropsWithChildren } from 'react';

import * as hal from '../../assets/hal.png';

const AuthCallbackLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <div>
      <div className="fixed flex h-full w-full animate-pulse items-center justify-center">
        <Image height={60} src={hal} width={60} />
      </div>
      {children}
    </div>
  );
};

type Props = {};

export default AuthCallbackLayout;
