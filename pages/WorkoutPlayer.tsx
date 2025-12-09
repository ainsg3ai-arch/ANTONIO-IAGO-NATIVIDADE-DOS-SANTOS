
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements, saveSetResult, getPersonalBest, getProfile } from '../services/storageService';
import { WorkoutSession, UserProfile } from '../types';
import { Button } from '../components/Button';
import { VideoPlayer } from '../components/VideoPlayer';
import { AICamera } from '../components/AICamera';
import { speak, playTone, initAudio } from '../services/audioService';
import { X, Info, ChevronRight, AlertCircle, Wind, Trophy, Timer, Check, Pause, Play, Camera, Eye, Vibrate, Zap } from 'lucide-react';

export const WorkoutPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  // Estados do Flow
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false); // Timer rodando?
  const [showInfo, setShowInfo] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // AI & Smart Features
  const [showCamera, setShowCamera] = useState(false);
  const [repsDone, setRepsDone] = useState('');
  const [currentPR, setCurrentPR] = useState(0);
  const [sessionCalories, setSessionCalories] = useState(0);

  // Timer Ref (Crucial para corrigir o bug de Start/Stop)
  const timerIntervalRef = useRef<number | null>(null);

  // Inicialização
  useEffect(() => {
    const w = getCurrentWorkout();
    const p = getProfile();
    if (!w) {
        navigate('/');
    } else { 
        setWorkout(w); 
        setProfile(p);
        initAudio(); 
        setTimer(0);
    }
    return () => stopTimer();
  }, []);

  // Monitorar mudança de exercício para carregar PR
  useEffect(() => {
      if(workout) {
          const exId = workout.exercises[currentExerciseIndex].id;
          setCurrentPR(getPersonalBest(exId));
          // Sugestão inicial de reps
          const suggested = workout.exercises[currentExerciseIndex].reps?.replace(/[^0-9]/g, '') || '10';
          setRepsDone(suggested);
      }
  }, [currentExerciseIndex, workout]);

  // --- LÓGICA DO TIMER (Robustness Fix) ---
  const startTimer = () => {
      if (timerIntervalRef.current) return; // Já está rodando
      
      playTone('start');
      setIsActive(true);
      
      // Haptic Feedback (Modo Silencioso)
      if (navigator.vibrate) navigator.vibrate(200);

      timerIntervalRef.current = window.setInterval(() => {
          setTimer(prev => prev + 1);
      }, 1000);
  };

  const stopTimer = () => {
      if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
      }
      setIsActive(false);
  };

  const toggleTimer = () => {
      if (isActive) stopTimer();
      else startTimer();
  };

  // --- CONTROLE DE FLUXO (NEXT / PREV) ---
  const handleNext = () => {
      stopTimer();
      setTimer(0);
      playTone('beep');

      if (!isResting) {
          // Finalizou exercício -> Vai para Descanso ou Save Log
          if (currentExerciseIndex >= (workout?.exercises.length || 0) - 1) {
              finishWorkout();
          } else {
              setIsResting(true);
              // Smart Timer: Inicia descanso automaticamente
              startTimer(); 
          }
      } else {
          // Finalizou descanso -> Próximo exercício
          setIsResting(false);
          setCurrentExerciseIndex(prev => prev + 1);
          // Auto-start next exercise (Dynamic Flow)
          // startTimer(); // Opcional: Descomentar para fluxo hardcore
      }
  };

  const finishWorkout = () => {
      if(!workout) return;
      const completed = { 
          ...workout, 
          completed: true, 
          caloriesBurned: sessionCalories + 100, // Base burn + calculated
          durationTaken: Math.floor(timer / 60)
      };
      saveWorkoutSession(completed);
      saveCurrentWorkout(null);
      checkAndUnlockAchievements();
      playTone('success');
      setIsFinished(true);
  };

  // --- AI CAMERA HANDLERS ---
  const handleAIRepCount = () => {
      // Chamado pelo componente AICamera quando detecta uma rep
      setRepsDone(prev => (parseInt(prev || '0') + 1).toString());
      playTone('beep');
  };

  // --- RENDERIZADORES ---

  if (!workout || !workout.exercises.length) return null;
  const currentEx = workout.exercises[currentExerciseIndex];
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (isFinished) {
      return (
          <div className="h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="z-10 text-center animate-slide-up">
                  <div className="inline-block p-6 rounded-full bg-ains-primary/20 border-2 border-ains-primary mb-6 shadow-[0_0_50px_rgba(0,175,255,0.4)]">
                      <Trophy size={64} className="text-ains-primary" />
                  </div>
                  <h1 className="text-5xl font-display font-bold text-white uppercase italic mb-2">Missão Cumprida</h1>
                  <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase mb-8">XP Ganho: +150</p>
                  <Button onClick={() => navigate('/')} fullWidth variant="primary">Voltar ao QG</Button>
              </div>
          </div>
      );
  }

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden flex flex-col">
      
      {/* 1. LAYER DE MÍDIA (VÍDEO/CAMERA) */}
      <div className="absolute inset-0 z-0">
          {showCamera ? (
             <AICamera 
                isActive={showCamera} 
                exerciseType={currentEx.name}
                onRepCount={handleAIRepCount}
                onClose={() => setShowCamera(false)}
             />
          ) : (
             !isResting ? (
                 <VideoPlayer 
                    url={currentEx.videoUrl} 
                    title={currentEx.name} 
                    placeholder={currentEx.videoPlaceholder} 
                    autoPlay={isActive} // Video toca se timer estiver rodando
                    isActive={!isResting}
                 />
             ) : (
                 // TELA DE DESCANSO
                 <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center relative p-6">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse-slow"></div>
                     
                     <div className="z-10 text-center">
                         <h2 className="text-ains-primary font-bold uppercase tracking-widest text-sm mb-2">Recuperação</h2>
                         <div className="text-[100px] font-display font-bold text-white leading-none tabular-nums tracking-tighter">
                             {formatTime(timer)}
                         </div>
                         <p className="text-zinc-500 text-xs mt-4">Próximo: {workout.exercises[currentExerciseIndex + 1]?.name || 'FIM'}</p>
                     </div>

                     {/* LOGGING CARD DURANTE DESCANSO */}
                     <div className="z-20 mt-12 w-full max-w-xs bg-zinc-900/80 backdrop-blur border border-zinc-700 p-4 rounded-2xl">
                         <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase mb-2">
                             <span>Reps Feitas</span>
                             <span>Recorde: {currentPR}</span>
                         </div>
                         <div className="flex gap-2">
                             <input 
                                type="number" 
                                value={repsDone}
                                onChange={(e) => setRepsDone(e.target.value)}
                                className="flex-1 bg-black border border-zinc-600 rounded-lg text-center text-xl text-white font-bold py-2 focus:border-ains-primary outline-none"
                             />
                             <button 
                                onClick={() => { saveSetResult({ exerciseId: currentEx.id, date: Date.now(), reps: parseInt(repsDone) }); playTone('success'); }}
                                className="bg-ains-primary text-black px-4 rounded-lg font-bold"
                             >
                                 SALVAR
                             </button>
                         </div>
                     </div>
                 </div>
             )
          )}
          {/* Overlay gradiente para legibilidade */}
          {!isResting && !showCamera && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>}
      </div>

      {/* 2. TOP BAR */}
      <div className="relative z-20 flex justify-between items-center p-6 pt-8">
          <button onClick={() => { if(confirm("Abandonar missão?")) { saveCurrentWorkout(null); navigate('/'); } }} className="bg-black/30 backdrop-blur p-2 rounded-full text-white hover:bg-red-500 transition-colors">
              <X size={24}/>
          </button>
          
          {/* Progress Indicator */}
          <div className="flex gap-1">
             {workout.exercises.map((_, idx) => (
                 <div key={idx} className={`h-1.5 w-6 rounded-full transition-all ${idx === currentExerciseIndex ? 'bg-ains-primary shadow-[0_0_10px_#00AFFF]' : idx < currentExerciseIndex ? 'bg-zinc-600' : 'bg-zinc-800'}`}></div>
             ))}
          </div>

          <div className="flex gap-2">
              {!isResting && (
                  <button onClick={() => setShowCamera(!showCamera)} className={`p-2 rounded-full backdrop-blur transition-colors ${showCamera ? 'bg-ains-primary text-black' : 'bg-black/30 text-white'}`}>
                      <Camera size={24}/>
                  </button>
              )}
              <button onClick={() => setShowInfo(true)} className="bg-black/30 backdrop-blur p-2 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                  <Info size={24}/>
              </button>
          </div>
      </div>

      {/* 3. MAIN CONTROLS (BOTTOM) */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-10 px-6">
          {!isResting && !showCamera && (
              <div className="animate-slide-up">
                  <div className="flex items-end justify-between mb-4">
                      <div>
                          <h1 className="text-4xl font-display font-bold text-white uppercase italic leading-none drop-shadow-lg">{currentEx.name}</h1>
                          <div className="flex gap-2 mt-2">
                              <span className="bg-ains-primary/20 text-ains-primary border border-ains-primary/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{currentEx.muscleGroup}</span>
                              <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">{currentEx.reps} Reps</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 h-24">
                      {/* MAIN ACTION BUTTON (Start/Pause) */}
                      <button 
                        onClick={toggleTimer}
                        className={`flex-1 h-full rounded-2xl flex items-center justify-between px-6 border-2 transition-all active:scale-95 shadow-xl ${isActive ? 'bg-zinc-900/90 border-zinc-700 text-white' : 'bg-white border-white text-black'}`}
                      >
                          <div className="flex flex-col text-left">
                              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{isActive ? 'Tempo' : 'Iniciar'}</span>
                              <span className="text-4xl font-mono font-bold tracking-tighter">{formatTime(timer)}</span>
                          </div>
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isActive ? 'bg-red-500/20 text-red-500' : 'bg-black text-ains-primary'}`}>
                              {isActive ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1"/>}
                          </div>
                      </button>

                      {/* NEXT BUTTON */}
                      <button 
                        onClick={handleNext}
                        className="h-full w-24 bg-ains-primary rounded-2xl flex flex-col items-center justify-center text-black shadow-neon border-2 border-ains-primary hover:scale-105 active:scale-95 transition-transform"
                      >
                          <Check size={32} strokeWidth={4} />
                          <span className="text-[10px] font-black uppercase mt-1">Próximo</span>
                      </button>
                  </div>
              </div>
          )}

          {isResting && (
              <Button onClick={handleNext} fullWidth className="h-20 text-xl border-2 border-white/20 bg-zinc-900 hover:bg-ains-primary hover:text-black hover:border-ains-primary transition-colors">
                  PRONTO <ChevronRight className="ml-2"/>
              </Button>
          )}
      </div>

      {/* 4. INFO SHEET */}
      {showInfo && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl p-6 overflow-y-auto animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="font-display font-bold text-3xl uppercase italic text-white">Detalhes Táticos</h3>
                  <button onClick={() => setShowInfo(false)} className="bg-zinc-800 p-2 rounded-full text-white"><X /></button>
              </div>
              
              <div className="space-y-6">
                   <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                       <h4 className="font-bold text-ains-primary uppercase text-xs mb-2">Execução</h4>
                       <ul className="space-y-3">
                           {currentEx.stepByStep?.map((s, i) => (
                               <li key={i} className="flex gap-3 text-sm text-zinc-300">
                                   <span className="text-zinc-600 font-bold">{i+1}.</span> {s}
                               </li>
                           ))}
                       </ul>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-red-900/20 p-4 rounded-xl border border-red-900/50">
                           <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase mb-2"><AlertCircle size={14}/> Erros Comuns</div>
                           <p className="text-xs text-zinc-400">{currentEx.commonErrors?.[0]}</p>
                       </div>
                       <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-900/50">
                           <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase mb-2"><Wind size={14}/> Respiração</div>
                           <p className="text-xs text-zinc-400">{currentEx.breathingTip}</p>
                       </div>
                   </div>

                   {/* 3D Model Hints (Placeholder text for updated request) */}
                   <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                       <div>
                           <div className="text-xs font-bold text-white uppercase">Visualização 3D</div>
                           <div className="text-[10px] text-zinc-500">Músculos principais destacados</div>
                       </div>
                       <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center">
                           <Eye size={20} className="text-ains-primary"/>
                       </div>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};
