
import React, { useState, useEffect, useRef } from 'react';
import { Play, Loader2, RefreshCw, AlertCircle, Film } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  gifUrl?: string;
  placeholder?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  isActive?: boolean;
}

type MediaType = 'youtube' | 'tiktok' | 'native' | 'gif' | 'image';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  gifUrl,
  placeholder, 
  title, 
  className = "",
  autoPlay = false,
  isActive = false
}) => {
  const [activeType, setActiveType] = useState<MediaType>('image');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detecção do tipo de URL
  const getMediaType = (uri: string): MediaType => {
    if (!uri) return gifUrl ? 'gif' : 'image';
    
    // YouTube
    const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    if (uri.match(ytReg)) return 'youtube';
    
    // TikTok
    const ttReg = /tiktok\.com\/.*video\/(\d+)/;
    if (uri.match(ttReg)) return 'tiktok';
    
    // Direct Video (mp4, webm)
    if (uri.match(/\.(mp4|webm|ogg|mov)$/) || uri.includes('blob:')) return 'native';
    
    // GIF
    if (uri.match(/\.gif$/)) return 'gif';
    
    return 'image';
  };

  const getYouTubeId = (uri: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = uri.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getTikTokId = (uri: string) => {
    const regExp = /tiktok\.com\/.*video\/(\d+)/;
    const match = uri.match(regExp);
    return match ? match[1] : null;
  };

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setActiveType(getMediaType(url));
  }, [url, gifUrl]);

  // Fallback Logic
  const handleError = () => {
    console.warn(`Erro carregando ${activeType} para ${title}. Tentando fallback...`);
    if (activeType === 'youtube' || activeType === 'tiktok' || activeType === 'native') {
      if (gifUrl) setActiveType('gif');
      else setActiveType('image');
    } else if (activeType === 'gif') {
      setActiveType('image');
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Renderização condicional por tipo
  const renderContent = () => {
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-zinc-900 p-6 text-center">
          <AlertCircle className="text-ains-accent mb-2" size={32} />
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Falha Crítica de Mídia</p>
        </div>
      );
    }

    switch (activeType) {
      case 'youtube':
        const ytId = getYouTubeId(url);
        return (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=0&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=${ytId}&mute=1`}
            title={title}
            className="w-full h-full scale-[1.3] pointer-events-none"
            frameBorder="0"
            onLoad={handleLoad}
            onError={handleError}
          />
        );

      case 'tiktok':
        const ttId = getTikTokId(url);
        return (
          <iframe
            src={`https://www.tiktok.com/embed/v2/${ttId}?lang=pt-BR&autoplay=1`}
            title={title}
            className="w-full h-full pointer-events-none"
            frameBorder="0"
            onLoad={handleLoad}
            onError={handleError}
          />
        );

      case 'native':
        return (
          <video
            ref={videoRef}
            src={url}
            autoPlay={autoPlay && isActive}
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onCanPlay={handleLoad}
            onError={handleError}
          />
        );

      case 'gif':
        return (
          <img 
            src={url.match(/\.gif$/) ? url : gifUrl} 
            alt={title} 
            className="w-full h-full object-cover"
            onLoad={handleLoad}
            onError={handleError}
          />
        );

      case 'image':
      default:
        return (
          <img 
            src={placeholder || url} 
            alt={title} 
            className="w-full h-full object-cover opacity-60 grayscale"
            onLoad={handleLoad}
            onError={handleError}
          />
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Skeleton / Loading */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950">
          <Loader2 className="animate-spin text-ains-primary" size={40} />
        </div>
      )}

      {/* Main Content */}
      <div className={`w-full h-full transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {renderContent()}
      </div>

      {/* Contextual Overlay (Sutil) */}
      {!isLoading && !hasError && (
        <div className="absolute top-4 right-4 z-20 opacity-30 hover:opacity-100 transition-opacity">
            <div className="bg-black/50 p-2 rounded-full border border-white/10">
                {activeType === 'youtube' && <Play size={14} className="text-red-500" fill="currentColor" />}
                {activeType === 'tiktok' && <Film size={14} className="text-ains-primary" />}
                {activeType === 'native' && <Play size={14} className="text-ains-success" fill="currentColor" />}
                {activeType === 'gif' && <span className="text-[8px] font-black text-white">GIF</span>}
            </div>
        </div>
      )}
    </div>
  );
};
