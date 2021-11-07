import React, { Ref } from 'react';

const Button: React.FC<Props> = ({ children, ...rest }, ref) => {
  const bgColor =
    rest.nature === 'secondary' ? 'bg-bg-nav-offset' : 'bg-accent';
  const textColor =
    rest.nature === 'secondary' ? 'text-white' : 'text-bg-primary';

  return (
    <button
      {...rest}
      className={`flex items-center font-semibold text-sm rounded-md p-2 cursor-pointer whitespace-nowrap focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${textColor} ${rest.className}`}
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
