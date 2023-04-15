import React, { Ref } from 'react';

const Button: React.FC<Props> = ({ children, ...rest }, ref) => {
  const bgColor =
    rest.nature === 'secondary' ? 'bg-bg-nav-offset' : 'bg-neutral-900';
  const textColor = rest.nature === 'secondary' ? 'text-white' : 'text-white';

  const hoverColor =
    rest.nature === 'secondary' ? 'hover:bg-bg-nav' : 'hover:bg-neutral-800';

  return (
    <button
      {...rest}
      className={`flex cursor-pointer items-center whitespace-nowrap rounded-md border border-neutral-800 p-2 text-sm font-semibold focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${bgColor} ${textColor} ${rest.className} ${hoverColor}`}
      ref={rest.forwardedRef}
    >
      {children}
    </button>
  );
};

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  className?: string;
  disabled?: boolean;
  forwardedRef?: Ref<any>;
  nature?: 'primary' | 'secondary' | 'tertiary';
  offset?: boolean;
};

export default Button;
