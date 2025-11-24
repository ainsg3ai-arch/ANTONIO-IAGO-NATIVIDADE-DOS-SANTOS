import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  url: string;
  placeholder?: string;
  title: string;
  className?: string;
  autoPlayOnLoad?: boolean;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  url, 
  placeholder, 
  title, 
  className = "",
  autoPlayOnLoad = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlayOnLoad);

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) return <div className="bg-zinc-800 flex items-center justify-center h-full text-zinc-500">Vídeo indisponível</div>;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {!isPlaying ? (
        <button 
          onClick={() => setIsPlaying(true)}
          className="group relative w-full h-full block cursor-pointer"
        >
          <img 
            src={placeholder || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
            alt={title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play fill="white" className="text-white ml-1" size={32} />
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <span className="text-xs font-bold text-red-500 bg-black/50 px-2 py-1 rounded backdrop-blur-sm mb-2 inline-block">YOUTUBE</span>
            <h3 className="text-white font-bold truncate shadow-black drop-shadow-md">{title}</h3>
          </div>
        </button>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
};