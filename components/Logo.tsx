
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
        className="drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
      >
        {/* Background Hexagon Shape (Subtle) */}
        <path 
          d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z" 
          fill="#27272a" 
          opacity="0.5"
          transform="scale(0.9) translate(5, -2)"
        />
        
        {/* Main "A" / Arrow Shape */}
        <path 
          d="M50 15 L85 85 H15 L50 15Z" 
          stroke="#a3e635" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Energy Bolt Cutout / Center Detail */}
        <path 
          d="M50 35 V65 M35 65 L65 65" 
          stroke="#a3e635" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        
        {/* Dynamic Dot */}
        <circle cx="50" cy="28" r="4" fill="#fff" />
      </svg>

      {/* Text Wordmark */}
      {showText && (
        <div className="mt-3 flex flex-col items-center">
          <h1 className="text-3xl font-black tracking-tighter text-white italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            AINS<span className="text-ains-primary">FIT</span>
          </h1>
          <div className="h-1 w-12 bg-ains-primary rounded-full mt-1"></div>
        </div>
      )}
    </div>
  );
};
