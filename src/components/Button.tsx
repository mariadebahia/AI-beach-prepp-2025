import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'neon' | 'purple' | 'outline';
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'neon',
  className = '',
  disabled = false
}) => {
  const baseStyles = 'px-8 py-4 rounded-lg font-medium transition-all duration-300 text-[1.125rem] focus:outline-none';
  
  const variantStyles = {
    neon: 'bg-neon-green text-deep-purple hover:bg-opacity-90',
    purple: 'bg-deep-purple text-white hover:bg-opacity-90',
    outline: 'border-2 border-deep-purple text-deep-purple hover:bg-deep-purple hover:text-white'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;