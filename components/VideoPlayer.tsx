
import React, { useState, useEffect, useRef } from 'react';
import { Play, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sincroniza estado interno com a prop autoPlay/isActive
  useEffect(() => {
    if (isActive && autoPlay && !isPlaying) {
      setIsPlaying(true);
      setIsLoading(true);
    } else if (!isActive) {
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isActive, autoPlay]);

  const getVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  // SAFETY TIMEOUT: Se o vídeo demorar mais de 6s para carregar, remove o spinner
  useEffect(() => {
    let timeout: number;
    if (isLoading) {
      timeout = window.setTimeout(() => {
        setIsLoading(false);
      }, 6000);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleRetry = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLoadError(false);
      setIsPlaying(false);
      setTimeout(() => {
          setIsPlaying(true);
          setIsLoading(true);
      }, 100);
  }

  // Se URL for inválida ou erro
  if (!videoId) {
      return (
          <div className={`relative w-full h-full bg-zinc-900 flex flex-col items-center justify-center overflow-hidden border-b border-zinc-800 ${className}`}>
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-ains-primary to-black"></div>
              <div className="z-10 text-center px-6">
                 {placeholder ? (
                     <img src={placeholder} className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-2 border-zinc-800 opacity-60" alt={title}/>
                 ) : (
                     <div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center mx-auto mb-4">
                        <Play size={32} className="text-zinc-700" />
                     </div>
                 )}
                  <h3 className="text-white font-display font-bold uppercase text-xl tracking-wider">{title}</h3>
                  <p className="text-zinc-600 text-[10px] font-mono uppercase mt-2">Vídeo indisponível offline</p>
              </div>
          </div>
      );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&controls=0&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=${videoId}&mute=1&enablejsapi=1`;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      
      {(!isPlaying || loadError) && (
        <div 
          onClick={() => { setLoadError(false); setIsPlaying(true); setIsLoading(true); }}
          className="absolute inset-0 z-20 cursor-pointer group"
        >
          <img 
            src={placeholder || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
            alt={title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity grayscale hover:grayscale-0 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            {loadError ? (
                <div className="flex flex-col items-center">
                    <AlertCircle className="text-red-500 mb-2" size={32} />
                    <button onClick={handleRetry} className="bg-red-500/20 text-red-500 px-4 py-2 rounded-full text-xs font-bold uppercase border border-red-500/50 flex items-center gap-2">
                        <RefreshCw size={12}/> Recarregar
                    </button>
                </div>
            ) : (
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform">
                    <Play fill="white" className="text-white ml-1" size={32} strokeWidth={3} />
                </div>
            )}
          </div>
        </div>
      )}

      {(isPlaying && !loadError) && (
        <>
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                    <Loader2 className="animate-spin text-ains-primary" size={40} />
                </div>
            )}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                title={title}
                className={`w-full h-full absolute inset-0 z-0 pointer-events-none scale-[1.3] transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={handleIframeLoad}
                onError={() => { setLoadError(true); setIsLoading(false); }}
            />
        </>
      )}
    </div>
  );
};
