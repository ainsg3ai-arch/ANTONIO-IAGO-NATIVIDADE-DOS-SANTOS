
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 48, showText = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Icon Graphic */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_25px_rgba(0,175,255,0.4)]"
      >
        {/* Main "A" / Arrow Shape */}
        <path 
          d="M50 15 L85 85 H15 L50 15Z" 
          stroke="#00AFFF" 
          strokeWidth="8" 
          strokeLinecap="square" 
          strokeLinejoin="miter"
        />
        
        {/* Energy Bolt Cutout / Center Detail */}
        <path 
          d="M50 35 V65 M35 65 L65 65" 
          stroke="#00AFFF" 
          strokeWidth="6" 
          strokeLinecap="square"
        />
        
        {/* Dynamic Dot */}
        <circle cx="50" cy="28" r="4" fill="#fff" />
      </svg>

      {/* Text Wordmark */}
      {showText && (
        <div className="mt-3 flex flex-col items-center">
          <h1 className="text-3xl font-black tracking-tighter text-white italic transform -skew-x-6" style={{ fontFamily: 'Oswald, sans-serif' }}>
            AINS<span className="text-ains-primary">FIT</span>
          </h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-ains-primary to-transparent mt-1"></div>
        </div>
      )}
    </div>
  );
};
