import React, { Ref } from 'react';

const Button: React.FC<Props> = ({ children, ...rest }, ref) => {
  return (
    <button
      {...rest}
      className={`flex items-center font-semibold text-sm bg-accent text-bg-primary rounded-md p-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${rest.className}`}
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
};

export default Button;
