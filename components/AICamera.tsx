
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Scan, Activity, Eye, X } from 'lucide-react';

interface AICameraProps {
  onRepCount?: () => void;
  exerciseType: string;
  onClose: () => void;
  isActive: boolean;
}

export const AICamera: React.FC<AICameraProps> = ({ onRepCount, exerciseType, onClose, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permission, setPermission] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string>('Posicione o corpo na grade');

  // Simulator Interval
  useEffect(() => {
    let interval: number;
    if (isActive && permission) {
        setAnalyzing(true);
        // Simulação de detecção de repetições (apenas para demo UX)
        interval = window.setInterval(() => {
            if(Math.random() > 0.7) {
                setFeedback('Perfeito! Descendo...');
            } else if (Math.random() > 0.8) {
                if (onRepCount) {
                    onRepCount();
                    setFeedback('REP CONTADA! 🟢');
                    // Efeito visual no canvas (flash verde)
                    const ctx = canvasRef.current?.getContext('2d');
                    if(ctx && canvasRef.current) {
                        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        setTimeout(() => ctx.clearRect(0,0,1000,1000), 200);
                    }
                }
            } else {
                const tips = ['Mantenha a coluna reta', 'Desça mais devagar', 'Respire!', 'Contraia o abdômen'];
                setFeedback(tips[Math.floor(Math.random() * tips.length)]);
            }
        }, 3000);
    }
    return () => clearInterval(interval);
  }, [isActive, permission, onRepCount]);

  const startCamera = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
              setPermission(true);
          }
      } catch (err) {
          console.error("Camera denied", err);
          alert("Permissão de câmera negada. O modo IA não funcionará.");
          onClose();
      }
  };

  useEffect(() => {
      if (isActive) startCamera();
      else {
          const stream = videoRef.current?.srcObject as MediaStream;
          stream?.getTracks().forEach(t => t.stop());
      }
  }, [isActive]);

  // Simulação de Skeleton Tracking (Desenho no Canvas)
  useEffect(() => {
      if(!permission || !canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if(!ctx) return;
      
      const drawSkeleton = () => {
           if(!ctx || !canvasRef.current) return;
           const w = canvasRef.current.width;
           const h = canvasRef.current.height;
           ctx.clearRect(0, 0, w, h);
           
           // Simula pontos do corpo se movendo levemente
           const time = Date.now() / 1000;
           const headX = w/2 + Math.sin(time) * 10;
           const headY = h/3 + Math.cos(time*2) * 5;
           
           ctx.strokeStyle = '#00AFFF';
           ctx.lineWidth = 3;
           ctx.fillStyle = '#FFFFFF';
           
           // Head
           ctx.beginPath(); ctx.arc(headX, headY, 15, 0, Math.PI*2); ctx.stroke();
           // Body Line
           ctx.beginPath(); ctx.moveTo(headX, headY+15); ctx.lineTo(headX, headY+150); ctx.stroke();
           
           // Shoulders
           ctx.beginPath(); ctx.moveTo(headX-40, headY+40); ctx.lineTo(headX+40, headY+40); ctx.stroke();
           
           requestAnimationFrame(drawSkeleton);
      };
      
      const anim = requestAnimationFrame(drawSkeleton);
      return () => cancelAnimationFrame(anim);
  }, [permission]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black flex flex-col">
        {/* Camera Feed */}
        <div className="relative flex-1 overflow-hidden">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas 
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight * 0.7}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />
            
            {/* UI Overlays */}
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-ains-primary animate-pulse">
                            <Scan size={20}/>
                            <span className="font-bold text-xs uppercase tracking-widest">IA Analisando</span>
                        </div>
                        <h3 className="text-white font-display text-xl uppercase mt-1">{exerciseType}</h3>
                    </div>
                    <button onClick={onClose} className="bg-black/50 p-2 rounded-full text-white backdrop-blur"><X/></button>
                </div>
            </div>

            {/* Smart Feedback Box */}
            <div className="absolute bottom-8 left-6 right-6">
                <div className="bg-black/60 backdrop-blur-md border border-ains-primary/50 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-ains-primary/20 flex items-center justify-center">
                        <Activity className="text-ains-primary" />
                    </div>
                    <div>
                        <p className="text-ains-primary font-bold uppercase text-xs">Coach IA</p>
                        <p className="text-white font-bold text-lg leading-none">{feedback}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
