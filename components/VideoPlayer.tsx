
import React, { useState, useEffect } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  placeholder?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  isActive?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  placeholder, 
  title, 
  className = "",
  autoPlay = false,
  isActive = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
      if (isActive && autoPlay) {
          setIsPlaying(true);
      } else if (!isActive) {
          setIsPlaying(false);
      }
  }, [isActive, autoPlay]);

  const getVideoId = (url: string) => {
    // Suporte para YouTube standard, Short URLs e Shorts (Vertical)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  // Fallback UI (Animação 3D CSS pura se não houver vídeo)
  if (!videoId || hasError) {
      return (
          <div className={`relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center overflow-hidden ${className}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ains-primary/20 via-black to-black"></div>
              
              {/* Animated Pulse Circle */}
              <div className="relative z-10 w-32 h-32 rounded-full border-4 border-ains-primary/30 flex items-center justify-center animate-pulse-slow">
                  <div className="w-24 h-24 rounded-full bg-ains-primary/20 blur-md animate-pulse"></div>
                  <Play size={48} className="text-ains-primary absolute" fill="currentColor" />
              </div>
              
              <div className="z-10 mt-8 text-center px-6">
                  <h3 className="text-white font-display font-bold uppercase text-xl tracking-wider">{title}</h3>
                  <p className="text-zinc-500 text-xs mt-2 font-mono">Vídeo indisponível offline</p>
              </div>
          </div>
      );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&controls=0&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=${videoId}&mute=1`; // Muted required for autoplay in most browsers

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {!isPlaying ? (
        <div 
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 z-10 cursor-pointer group"
        >
          <img 
            src={placeholder || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
            alt={title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-ains-primary/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,175,255,0.4)] group-hover:scale-110 transition-transform backdrop-blur-sm">
              <Play fill="black" className="text-black ml-2" size={32} strokeWidth={3} />
            </div>
          </div>
        </div>
      ) : (
        <>
            {isLoading && (
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
                    <Loader2 className="animate-spin text-ains-primary" size={40} />
                </div>
            )}
            <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full absolute inset-0 z-0 pointer-events-none scale-[1.35]" // Scale to fill "TikTok style" removing black bars from 16:9 videos
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
            />
        </>
      )}
    </div>
  );
};
