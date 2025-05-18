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
  const baseStyles = 'min-h-[44px] px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-300 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-beach-purple w-full sm:w-auto';
  
  const variantStyles = {
    neon: 'bg-neon-green text-deep-purple hover:bg-opacity-90',
    purple: 'bg-beach-purple text-white hover:bg-opacity-90',
    outline: 'border-2 border-beach-purple text-beach-purple hover:bg-beach-purple hover:text-white'
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