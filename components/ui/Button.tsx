import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseStyles = "font-mono uppercase tracking-wider transition-all duration-300 ease-out border focus:outline-none focus:ring-2 focus:ring-swiss-black focus:ring-offset-2";
  
  const variants = {
    primary: "bg-swiss-black text-swiss-bg border-swiss-black hover:bg-swiss-red hover:border-swiss-red hover:text-white",
    secondary: "bg-swiss-red text-white border-swiss-red hover:bg-swiss-black hover:border-swiss-black",
    outline: "bg-transparent text-swiss-black border-swiss-black hover:bg-swiss-black hover:text-swiss-bg"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};