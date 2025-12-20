
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements } from '../services/storageService';
import { WorkoutSession, Exercise } from '../types';
import { Button } from '../components/Button';
import { VideoPlayer } from '../components/VideoPlayer';
import { playTone, initAudio } from '../services/audioService';
import { Check, Pause, Play, Trophy, Zap, Wind, RotateCcw } from 'lucide-react';

const REST_TIME = 20;

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
    setTimeout(() => startTimer(), 800);
    return () => stopTimer();
  }, []);

  const startTimer = () => {
      if (timerRef.current) return;
      setIsActive(true);
      if (navigator.vibrate) navigator.vibrate(40);
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
              if (prev <= 3 && prev > 1 && navigator.vibrate) navigator.vibrate(30);
              if (prev <= 1) { stopRest(); return 0; }
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
      if (currentIdx >= (workout?.exercises.length || 0) - 1) finishWorkout();
      else startRest();
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

  if (!workout) return null;
  const currentEx = workout.exercises[currentIdx];

  if (isFinished) {
      return (
          <div className="h-screen bg-ains-bg flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-ains-primary/10 rounded-full flex items-center justify-center border-2 border-ains-primary mb-6 shadow-neon">
                  <Trophy size={48} className="text-ains-primary" />
              </div>
              <h1 className="text-5xl font-display font-bold text-white uppercase italic leading-none mb-3 tracking-tighter">Elite</h1>
              <p className="text-ains-muted font-bold uppercase text-[10px] tracking-[0.4em] mb-12">Treino Finalizado</p>
              <Button onClick={() => navigate('/')} fullWidth variant="success" className="text-lg py-5">Retornar à Base</Button>
          </div>
      );
  }

  return (
    <div className="h-screen w-full bg-ains-bg flex flex-col overflow-hidden">
        {/* Progress Tracker Topo */}
        <div className="flex gap-1 p-2 bg-black/40">
            {workout.exercises.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < currentIdx ? 'bg-ains-success' : i === currentIdx ? 'bg-ains-primary shadow-neon' : 'bg-white/10'}`}></div>
            ))}
        </div>

        {/* Vídeo / Visualização Principal */}
        <div className="relative h-[42%] w-full bg-black">
            {isResting ? (
                <div className="h-full flex flex-col items-center justify-center bg-ains-primary/5 text-center">
                    <span className="text-ains-primary text-xs font-black uppercase tracking-[0.4em] mb-4">Descanso Ativo</span>
                    <div className="text-[140px] font-display font-bold text-white leading-none tabular-nums animate-pulse">
                        {timer}
                    </div>
                    <p className="text-ains-muted text-sm mt-4 uppercase font-bold tracking-widest">Próximo: {workout.exercises[currentIdx + 1]?.name}</p>
                    <button onClick={stopRest} className="mt-8 text-ains-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        Pular Descanso <RotateCcw size={12}/>
                    </button>
                </div>
            ) : (
                <VideoPlayer 
                    url={currentEx.videoUrl} 
                    gifUrl={currentEx.gifUrl}
                    title={currentEx.name} 
                    placeholder={currentEx.videoPlaceholder} 
                    autoPlay={isActive}
                    isActive={!isResting}
                    className="h-full w-full"
                />
            )}
        </div>

        {/* Info e Controles */}
        <div className="flex-1 p-8 flex flex-col justify-between bg-gradient-to-b from-ains-bg to-black">
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h2 className="text-4xl font-display font-bold uppercase italic text-white leading-[0.9] tracking-tighter mb-2">
                            {isResting ? 'Recupere o Fôlego' : currentEx.name}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="bg-ains-surface text-ains-muted text-[10px] px-3 py-1 rounded-full font-black uppercase border border-white/5 tracking-widest">Série {currentIdx + 1}/{workout.exercises.length}</span>
                        </div>
                    </div>
                </div>

                {!isResting && (
                    <div className="bg-ains-surface/50 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                        <h3 className="text-ains-primary text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Wind size={14}/> Instrução Técnica
                        </h3>
                        <p className="text-zinc-300 text-sm leading-relaxed italic">"{currentEx.description}"</p>
                        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[8px] text-ains-muted uppercase font-black mb-1">Objetivo</p>
                                <p className="text-white font-display font-bold text-lg">{currentEx.reps || currentEx.durationSeconds + 's'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] text-ains-muted uppercase font-black mb-1">Foco Principal</p>
                                <p className="text-white font-display font-bold text-lg">{currentEx.muscleGroup}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controles Gigantes para Uso Fácil */}
            <div className="space-y-4 pt-4">
                <div className="flex gap-4 h-24">
                    <button 
                        onClick={() => isActive ? stopTimer() : startTimer()}
                        className={`flex-1 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-[0.97] ${isActive ? 'bg-ains-surface text-ains-muted' : 'bg-white text-black shadow-neon'}`}
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                        <span className="text-3xl font-display font-bold uppercase italic tabular-nums">
                            {timer > 0 ? (timer > 60 ? Math.floor(timer/60) + ':' + (timer%60).toString().padStart(2,'0') : timer + 's') : (isActive ? 'Ativo' : 'Iniciar')}
                        </span>
                    </button>

                    {!isResting && (
                        <button 
                            onClick={handleNext}
                            className="w-24 bg-ains-primary text-ains-bg rounded-[2rem] flex items-center justify-center shadow-neon active:scale-[0.97]"
                        >
                            <Check size={40} strokeWidth={4} />
                        </button>
                    )}
                </div>
                
                <button 
                    onClick={() => { if(confirm("Encerrar protocolo?")) navigate('/'); }}
                    className="w-full text-ains-muted text-[10px] font-black uppercase tracking-[0.4em] py-2 hover:text-white transition-colors"
                >
                    Abandonar Sessão
                </button>
            </div>
        </div>
    </div>
  );
};
