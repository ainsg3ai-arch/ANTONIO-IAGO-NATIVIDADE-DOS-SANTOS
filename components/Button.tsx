
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-8 py-4 font-display font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none rounded-2xl flex items-center justify-center gap-2 overflow-hidden";
  
  const variants = {
    primary: "bg-ains-primary text-ains-bg shadow-neon hover:brightness-110",
    secondary: "bg-ains-surface text-white hover:bg-ains-card",
    outline: "bg-transparent border-2 border-ains-primary text-ains-primary hover:bg-ains-primary/5",
    danger: "bg-ains-accent text-white",
    success: "bg-ains-success text-ains-bg shadow-success"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
