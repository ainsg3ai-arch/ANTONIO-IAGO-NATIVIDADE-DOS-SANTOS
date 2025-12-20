
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  color?: 'primary' | 'white' | 'black';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 64, 
  showText = true,
  color = 'primary'
}) => {
  const getColors = () => {
    switch(color) {
      case 'white': return { main: '#FFFFFF', secondary: '#FFFFFF' };
      case 'black': return { main: '#121212', secondary: '#121212' };
      default: return { main: '#00AFFF', secondary: '#FFFFFF' };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* AF MONOGRAM SYMBOL */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_15px_rgba(0,175,255,0.3)] transform -skew-x-6"
      >
        {/* Base Shape A + F Integration */}
        {/* Diagonal of A */}
        <path 
          d="M20 85 L50 15 L58 15 L58 85" 
          stroke={colors.main} 
          strokeWidth="12" 
          strokeLinejoin="round"
        />
        
        {/* Top Bar of F */}
        <path 
          d="M58 21 H85" 
          stroke={colors.main} 
          strokeWidth="12" 
          strokeLinecap="square"
        />
        
        {/* Middle Bar of F */}
        <path 
          d="M58 50 H75" 
          stroke={colors.main} 
          strokeWidth="12" 
          strokeLinecap="square"
        />

        {/* Interior Accent Dot/Line for A-bar */}
        <path 
          d="M38 58 H48" 
          stroke={colors.secondary} 
          strokeWidth="4" 
          strokeLinecap="round"
          className="opacity-80"
        />
      </svg>

      {/* Wordmark */}
      {showText && (
        <div className="mt-4 flex flex-col items-center">
          <h1 className="text-4xl font-display font-bold tracking-tighter text-white italic leading-none" style={{ letterSpacing: '-0.05em' }}>
            AINS<span className="text-ains-primary">FIT</span>
          </h1>
          <div className="flex items-center gap-1 mt-1 opacity-40">
              <div className="h-[1px] w-8 bg-white"></div>
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">ELITE PROTOCOL</span>
              <div className="h-[1px] w-8 bg-white"></div>
          </div>
        </div>
      )}
    </div>
  );
};
