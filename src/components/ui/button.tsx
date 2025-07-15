import React, { forwardRef } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  return (
    <button
      ref={ref}
      {...props}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontWeight: 'bold',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        marginBottom: '0.25rem',
        ...props.style,
      }}
      className={props.className}
    >
      {props.children}
    </button>
  );
});
