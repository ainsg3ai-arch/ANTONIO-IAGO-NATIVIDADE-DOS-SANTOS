
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements } from '../services/storageService';
import { WorkoutSession, Exercise } from '../types';
import { Button } from '../components/Button';
import { VideoPlayer } from '../components/VideoPlayer';
import { playTone, initAudio } from '../services/audioService';
import { X, Check, Pause, Play, Wind, Trophy, Zap, Flame, RotateCcw } from 'lucide-react';

const REST_TIME = 15; // Descanso padrão estilo Home Workout

export const WorkoutPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const w = getCurrentWorkout();
    if (!w || !w.exercises.length) { navigate('/'); return; }
    setWorkout(w);
    initAudio();
    
    // Auto start on first exercise
    setTimeout(() => startTimer(), 500);

    return () => stopTimer();
  }, []);

  const startTimer = () => {
      if (timerRef.current) return;
      setIsActive(true);
      if (navigator.vibrate) navigator.vibrate(50);
      
      timerRef.current = window.setInterval(() => {
          setTimer(prev => prev + 1);
      }, 1000);
  };

  const stopTimer = () => {
      if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
      }
      setIsActive(false);
  };

  const startRest = () => {
      stopTimer();
      setIsResting(true);
      setTimer(REST_TIME);
      playTone('success');
      
      timerRef.current = window.setInterval(() => {
          setTimer(prev => {
              if (prev <= 3 && prev > 1 && navigator.vibrate) {
                  navigator.vibrate([50]); // Feedback tátil fim de descanso
              }
              if (prev <= 1) {
                  stopRest();
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const stopRest = () => {
      stopTimer();
      setIsResting(false);
      setTimer(0);
      setCurrentIdx(prev => prev + 1);
      playTone('start');
      if (navigator.vibrate) navigator.vibrate(100);
      startTimer();
  };

  const handleNext = () => {
      if (currentIdx >= (workout?.exercises.length || 0) - 1) {
          finishWorkout();
      } else {
          startRest();
      }
  };

  const finishWorkout = () => {
      if(!workout) return;
      const completed = { ...workout, completed: true, dateCreated: Date.now() };
      saveWorkoutSession(completed);
      saveCurrentWorkout(null);
      checkAndUnlockAchievements();
      playTone('success');
      setIsFinished(true);
  };

  const formatTime = (s: number) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!workout) return null;
  const currentEx = workout.exercises[currentIdx];

  if (isFinished) {
      return (
          <div className="h-screen bg-black flex flex-col items-center justify-center p-8 animate-fade-in text-center">
              <div className="w-24 h-24 bg-ains-primary/10 rounded-full flex items-center justify-center border-2 border-ains-primary mb-6 shadow-neon">
                  <Trophy size={48} className="text-ains-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-white uppercase italic mb-2">Treino Concluído</h1>
              <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-12">Você venceu o dia de hoje.</p>
              <Button onClick={() => navigate('/')} fullWidth variant="primary">Continuar</Button>
          </div>
      );
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col relative overflow-hidden page-transition">
        {/* 1. Área de Vídeo / Descanso */}
        <div className="relative h-[45%] w-full bg-zinc-950 border-b border-white/5">
            {isResting ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-ains-primary/5 animate-pulse">
                    <span className="text-ains-primary text-xs font-black uppercase tracking-[0.3em] mb-4">Descanso</span>
                    <div className="text-[140px] font-display font-bold text-white leading-none tabular-nums text-glow">
                        {timer}
                    </div>
                    <p className="text-zinc-500 text-sm mt-4 uppercase font-bold">Próximo: {workout.exercises[currentIdx + 1]?.name}</p>
                    <button onClick={stopRest} className="mt-6 flex items-center gap-2 text-zinc-600 uppercase font-black text-[10px] tracking-widest">
                        Pular Descanso <RotateCcw size={12}/>
                    </button>
                </div>
            ) : (
                <VideoPlayer 
                    url={currentEx.videoUrl} 
                    title={currentEx.name} 
                    placeholder={currentEx.videoPlaceholder} 
                    autoPlay={isActive}
                    isActive={!isResting}
                    className="h-full w-full"
                />
            )}
        </div>

        {/* 2. Informação do Exercício */}
        <div className="flex-1 flex flex-col p-6 pt-10 justify-between bg-gradient-to-b from-zinc-950 to-black">
            <div className="animate-slide-up">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-4xl font-display font-bold uppercase italic text-white leading-none tracking-tighter">
                        {isResting ? 'Recupere o Fôlego' : currentEx.name}
                    </h2>
                    <div className="text-ains-primary font-mono font-bold text-sm">{currentIdx + 1}/{workout.exercises.length}</div>
                </div>
                
                {!isResting && (
                    <div className="mt-6 space-y-4">
                        <div className="flex gap-2">
                            {currentEx.musculosPrimarios.map(m => (
                                <span key={m} className="bg-zinc-900 text-zinc-400 text-[10px] px-3 py-1 rounded-full font-black uppercase border border-zinc-800">{m}</span>
                            ))}
                        </div>
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2 flex items-center gap-2">
                                <Wind size={12} className="text-ains-primary"/> Como fazer
                            </h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">{currentEx.description}</p>
                            {currentEx.commonErrors && currentEx.commonErrors.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
                                    <span className="text-[8px] font-black bg-red-900/20 text-red-500 px-1.5 py-0.5 rounded uppercase">Evite</span>
                                    <p className="text-zinc-500 text-[10px]">{currentEx.commonErrors[0]}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Controles Estilo Home Workout */}
            <div className="space-y-4 pb-4">
                <div className="flex gap-4 h-24">
                    <button 
                        onClick={() => isActive ? stopTimer() : startTimer()}
                        className={`flex-1 rounded-3xl flex flex-col items-center justify-center transition-all btn-active ${isActive ? 'bg-zinc-900 border border-zinc-800 text-zinc-500' : 'bg-white text-black shadow-neon'}`}
                    >
                        <div className="flex items-center gap-3">
                            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                            <span className="text-3xl font-display font-bold uppercase italic tabular-nums">{formatTime(timer)}</span>
                        </div>
                    </button>

                    {!isResting && (
                        <button 
                            onClick={handleNext}
                            className="w-24 bg-ains-primary text-black rounded-3xl flex flex-col items-center justify-center shadow-neon btn-active"
                        >
                            <Check size={32} strokeWidth={4} />
                            <span className="text-[8px] font-black uppercase mt-1">Feito</span>
                        </button>
                    )}
                </div>
                
                <button 
                    onClick={() => { if(confirm("Abandonar treino?")) navigate('/'); }}
                    className="w-full text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em] py-2"
                >
                    Abandonar Sessão
                </button>
            </div>
        </div>
    </div>
  );
};
