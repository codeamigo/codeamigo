import React from 'react';

import { IconType } from './types';

const Icon: React.FC<Props> = ({ className, name, ...rest }) => {
  return (
    <span
      className={`ICON icon-${name} flex items-center justify-center ${className}`}
      role="button"
      {...rest}
    ></span>
  );
};

type Props = {
  name: IconType;
  className: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

export default Icon;
