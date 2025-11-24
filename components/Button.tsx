import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-ains-primary text-ains-black hover:bg-lime-300 shadow-lg shadow-lime-900/20",
    secondary: "bg-ains-card text-white hover:bg-zinc-700 border border-zinc-700",
    outline: "border-2 border-ains-primary text-ains-primary hover:bg-ains-primary/10",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};