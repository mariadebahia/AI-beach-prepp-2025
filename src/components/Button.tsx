import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'neon' | 'purple' | 'outline' | 'outline-purple';
  className?: string;
  disabled?: boolean;
  as?: 'button' | 'a';
  href?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'neon',
  className = '',
  disabled = false,
  as = 'button',
  href
}) => {
  const baseStyles = 'px-8 py-4 rounded-lg font-medium transition-all duration-300 text-[1.125rem] focus:outline-none';
  
  const variantStyles = {
    neon: 'bg-neon-green text-deep-purple hover:bg-opacity-90',
    purple: 'bg-deep-purple text-white hover:bg-opacity-90',
    outline: 'border-2 border-white text-white hover:bg-[#d8d355] hover:text-white',
    'outline-purple': 'border-2 border-deep-purple text-deep-purple hover:bg-deep-purple hover:text-white'
  };

  const Component = as;
  const props = {
    ...(as === 'button' ? { type } : {}),
    ...(as === 'a' ? { href } : {}),
    onClick,
    disabled,
    className: `${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  return <Component {...props}>{children}</Component>;
};

export default Button;