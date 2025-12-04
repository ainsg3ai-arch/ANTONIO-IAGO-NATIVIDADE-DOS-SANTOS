
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
  // Estilo "Industrial/Rock": Uppercase, Bold, levemente inclinado (skew)
  const baseStyles = "relative px-6 py-4 font-display font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transform -skew-x-3 overflow-hidden group";
  
  const variants = {
    // Azul Elétrico Sólido
    primary: "bg-ains-primary text-black hover:bg-white hover:text-black shadow-neon",
    // Metal Escuro
    secondary: "bg-ains-surface border border-zinc-700 text-white hover:border-ains-primary hover:text-ains-primary",
    // Outline Neon
    outline: "bg-transparent border-2 border-ains-primary text-ains-primary hover:bg-ains-primary/10",
    // Vermelho Alerta
    danger: "bg-ains-accent text-white hover:bg-red-700 shadow-neon-red"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Glitch Effect Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
      
      {/* Un-skew text for readability */}
      <span className="block transform skew-x-3">{children}</span>
    </button>
  );
};
