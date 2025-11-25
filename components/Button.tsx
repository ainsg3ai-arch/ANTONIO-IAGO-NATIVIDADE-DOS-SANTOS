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
  // Mais angular (rounded-sm), mais agressivo
  const baseStyles = "px-6 py-4 font-display font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-sm border-2";
  
  const variants = {
    primary: "bg-ains-primary border-ains-primary text-black hover:bg-yellow-400 hover:border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]",
    secondary: "bg-ains-card border-zinc-700 text-white hover:border-zinc-500 hover:bg-zinc-800",
    outline: "bg-transparent border-ains-primary text-ains-primary hover:bg-ains-primary/10",
    danger: "bg-red-600 border-red-600 text-white hover:bg-red-700"
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