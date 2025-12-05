import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements } from '../services/storageService';
import { WorkoutSession, Exercise } from '../types';
import { Button } from '../components/Button';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { speak, playTone, initAudio } from '../services/audioService';
import { X, Info, ChevronRight, AlertCircle, Wind, Trophy, Timer, Check, SkipForward } from 'lucide-react';

export const WorkoutPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sessionCalories, setSessionCalories] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  useEffect(() => {
    const w = getCurrentWorkout();
    if (!w) navigate('/');
    else { setWorkout(w); initAudio(); }
  }, [navigate]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if(isActive && !isResting && workout && timer > 0 && timer % 60 === 0) {
        const currentEx = workout.exercises[currentExerciseIndex];
        const burnRate = currentEx.caloriesPerMinute || 5;
        setSessionCalories(prev => prev + burnRate);
    }
  }, [timer, isActive, isResting, workout, currentExerciseIndex]);

  useEffect(() => {
    if(!workout || isFinished) return;
    const ex = workout.exercises[currentExerciseIndex];
    if (isResting) speak("Descanso. Respire fundo.");
    else {
        speak(ex.name);
        if(ex.breathingTip) setTimeout(() => speak(ex.breathingTip || ""), 2000);
    }
  }, [currentExerciseIndex, isResting, isFinished]);

  if (!workout) return null;

  const currentEx = workout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const finishWorkout = () => {
      const completedWorkout = { 
          ...workout, 
          completed: true, 
          dateCreated: Date.now(),
          caloriesBurned: sessionCalories 
      };
      saveWorkoutSession(completedWorkout);
      saveCurrentWorkout(null);
      const unlocked = checkAndUnlockAchievements();
      setNewAchievements(unlocked);
      playTone('success');
      setIsFinished(true);
  }

  const handleNext = () => {
    playTone('start');
    setIsActive(false);
    
    if (!isResting) {
        const burnRate = currentEx.caloriesPerMinute || 5;
        const additionalCals = Math.floor((timer % 60) / 60 * burnRate);
        setSessionCalories(prev => prev + additionalCals);
    }

    setTimer(0);
    if (isResting) {
        setIsResting(false);
        setCurrentExerciseIndex(p => p + 1);
    } else {
        if (currentExerciseIndex === workout.exercises.length - 1) {
            finishWorkout();
        } else {
            setIsResting(true);
            setIsActive(true);
        }
    }
  };

  if (isFinished) {
      return (
          <div className="h-screen bg-ains-bg flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              
              <div className="w-full max-w-sm glass-panel p-8 rounded-3xl relative z-10 text-center animate-slide-up border border-ains-primary/20">
                   <div className="flex justify-center mb-6">
                        <div className="p-6 rounded-full bg-ains-primary/10 border-2 border-ains-primary shadow-neon">
                             <Trophy size={48} className="text-ains-primary" />
                        </div>
                   </div>
                   
                   <h2 className="text-4xl font-display font-bold uppercase text-white mb-2 italic tracking-tighter">Mission<br/>Complete</h2>
                   <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-8">AINSFIT • {new Date().toLocaleDateString()}</p>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                           <div className="text-white text-3xl font-bold font-display italic">{Math.floor(sessionCalories)}</div>
                           <div className="text-[10px] text-ains-primary uppercase font-bold tracking-wider">Calorias</div>
                       </div>
                       <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                           <div className="text-white text-3xl font-bold font-display italic">{Math.floor(workout.durationTaken || timer / 60)}<span className="text-sm">m</span></div>
                           <div className="text-[10px] text-ains-primary uppercase font-bold tracking-wider">Tempo</div>
                       </div>
                   </div>

                   <Button onClick={() => navigate('/')} fullWidth variant="primary">Continuar</Button>
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen flex flex-col bg-ains-bg text-white relative font-sans overflow-hidden">
      
      {/* EXERCISE MODE */}
      {!isResting ? (
          <>
            {/* Header / Progress */}
            <div className="absolute top-0 left-0 w-full z-20 p-6 bg-gradient-to-b from-black via-black/50 to-transparent">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => { if(confirm("Abortar missão?")) { saveCurrentWorkout(null); navigate('/'); } }} className="bg-black/40 backdrop-blur p-2 rounded-full border border-white/10 hover:bg-red-500/20 hover:border-red-500 transition-colors">
                        <X className="text-white" size={20}/>
                    </button>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                        <span className="text-xs font-bold font-mono text-ains-primary">{currentExerciseIndex + 1}</span>
                        <span className="text-[10px] text-zinc-500">/</span>
                        <span className="text-xs font-bold font-mono text-zinc-400">{workout.exercises.length}</span>
                    </div>
                    <button onClick={() => setShowInfo(!showInfo)} className="bg-black/40 backdrop-blur p-2 rounded-full border border-white/10 hover:border-ains-primary transition-colors">
                        <Info className="text-white" size={20}/>
                    </button>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-ains-primary h-full transition-all duration-300 shadow-[0_0_10px_#00AFFF]" style={{width: `${progress}%`}}></div>
                </div>
            </div>

            {/* Video Area */}
            <div className="absolute inset-0 z-0 bg-zinc-900">
                <YouTubeEmbed url={currentEx.videoUrl} title={currentEx.name} placeholder={currentEx.videoPlaceholder} className="opacity-80 grayscale-[30%] contrast-110" autoPlayOnLoad />
                {/* Gradient Overlay Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-ains-bg via-ains-bg/90 to-transparent pointer-events-none"></div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 w-full z-20 px-6 pb-8">
                
                <div className="mb-8 animate-slide-up">
                    <h2 className="text-5xl font-display font-bold uppercase italic leading-[0.85] mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 drop-shadow-sm">{currentEx.name}</h2>
                    <div className="flex items-center gap-4">
                        <div className="bg-ains-primary text-black px-3 py-1 font-bold text-lg uppercase transform -skew-x-12">
                            {currentEx.reps || `${currentEx.durationSeconds}s`}
                        </div>
                        <span className="text-zinc-400 text-sm font-bold tracking-widest uppercase border-l border-zinc-700 pl-4">{currentEx.sets} SÉRIES</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {currentEx.musculosPrimarios.slice(0, 3).map(m => (
                        <span key={m} className="bg-white/5 backdrop-blur px-3 py-1 rounded-md text-[10px] uppercase font-bold text-ains-primary border border-ains-primary/20">{m}</span>
                    ))}
                </div>

                {/* Main Action Bar */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-zinc-900/80 backdrop-blur border border-zinc-700 p-1 rounded-2xl flex justify-between items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-ains-primary/5 group-hover:bg-ains-primary/10 transition-colors"></div>
                        <div className="pl-6 font-mono text-4xl font-bold text-white tracking-tighter">{formatTime(timer)}</div>
                        <button 
                            onClick={() => {playTone('start'); setIsActive(!isActive)}} 
                            className={`mr-2 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all ${isActive ? 'bg-zinc-800 text-white border border-zinc-600' : 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'}`}
                        >
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                    </div>
                    
                    <button 
                        onClick={handleNext} 
                        className="bg-ains-primary text-black w-20 h-20 rounded-2xl flex items-center justify-center shadow-neon hover:scale-105 active:scale-95 transition-transform border-4 border-ains-bg"
                    >
                        <Check size={36} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Info Slide-Up */}
            {showInfo && (
                <div className="absolute inset-0 z-30 bg-ains-bg/95 backdrop-blur-xl p-6 overflow-y-auto animate-fade-in">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <h3 className="font-display font-bold text-3xl uppercase italic text-white">Intel</h3>
                        <button onClick={() => setShowInfo(false)} className="bg-white/10 p-2 rounded-full"><X /></button>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-zinc-900 p-5 rounded-2xl border border-red-500/20">
                             <div className="flex items-center gap-2 mb-3 text-red-500 font-bold uppercase text-xs tracking-wider"><AlertCircle size={16}/> Erros Comuns</div>
                             <ul className="list-disc pl-4 text-sm text-zinc-300 space-y-2 leading-relaxed">
                                 {currentEx.commonErrors?.map((e, i) => <li key={i}>{e}</li>)}
                             </ul>
                        </div>

                         <div className="bg-zinc-900 p-5 rounded-2xl border border-blue-500/20">
                             <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold uppercase text-xs tracking-wider"><Wind size={16}/> Respiração</div>
                             <p className="text-sm text-zinc-300 leading-relaxed">{currentEx.breathingTip}</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-zinc-500 uppercase text-xs mb-4 tracking-widest">Execução</h4>
                            <div className="space-y-4">
                                {currentEx.stepByStep?.map((s, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-sm bg-ains-primary flex items-center justify-center text-xs font-bold text-black shrink-0 transform -skew-x-6">{i+1}</div>
                                        <p className="text-sm text-zinc-300 leading-relaxed">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </>
      ) : (
          // REST MODE (Rock Style)
          <div className="flex-1 flex flex-col items-center justify-center bg-ains-bg p-8 relative overflow-hidden">
               {/* Animated Background */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ains-primary/10 via-transparent to-transparent opacity-50 animate-pulse-slow"></div>
               
               <div className="z-10 text-center w-full max-w-sm">
                   <h2 className="text-ains-primary font-black uppercase tracking-[0.3em] text-sm mb-12 border-b border-ains-primary/30 pb-4 inline-block">Recuperação</h2>
                   
                   <div className="relative mb-16">
                       <div className="text-[120px] font-display font-bold text-white leading-none tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                           {formatTime(timer)}
                       </div>
                   </div>

                   <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/5">
                       <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">Próximo Desafio</div>
                       <div className="text-2xl font-display font-bold text-white uppercase italic truncate">
                           {workout.exercises[currentExerciseIndex + 1]?.name || "FINALIZAR"}
                       </div>
                   </div>

                   <Button onClick={handleNext} variant="outline" fullWidth className="border-zinc-700 text-zinc-400 hover:text-white hover:border-white">
                       <SkipForward size={18} className="mr-2"/> Pular Descanso
                   </Button>
               </div>
          </div>
      )}
    </div>
  );
};