
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements } from '../services/storageService';
import { WorkoutSession, Exercise } from '../types';
import { Button } from '../components/Button';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { speak, playTone, initAudio } from '../services/audioService';
import { Timer, CheckCircle, X, Info, Flame, Activity, Trophy, Share2, Camera, BicepsFlexed } from 'lucide-react';

export const WorkoutPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sessionCalories, setSessionCalories] = useState(0);
  
  // Finish State
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

  // Calculate Calories
   useEffect(() => {
    if(isActive && !isResting && workout && timer > 0 && timer % 60 === 0) {
        const currentEx = workout.exercises[currentExerciseIndex];
        const burnRate = currentEx.caloriesPerMinute || 5;
        setSessionCalories(prev => prev + burnRate);
    }
  }, [timer, isActive, isResting, workout, currentExerciseIndex]);

  // Beeps Countdown
  useEffect(() => {
      if(!workout || !isActive) return;
      const ex = workout.exercises[currentExerciseIndex];
      if (!isResting && ex.durationSeconds) {
          if (ex.durationSeconds - timer <= 3 && ex.durationSeconds - timer > 0) playTone('beep');
      }
  }, [timer]);

  // Voice Coach
  useEffect(() => {
    if(!workout || isFinished) return;
    const ex = workout.exercises[currentExerciseIndex];
    if (isResting) speak("Descanso.");
    else setTimeout(() => speak(ex.name), 500);
  }, [currentExerciseIndex, isResting, isFinished]);

  if (!workout) return null;

  const currentEx = workout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const finishWorkout = () => {
      // Save final stats
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
      setIsFinished(true); // Show Summary Screen
  }

  const handleNext = () => {
    playTone('start');
    setIsActive(false);
    
    // Add partial calories
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
          <div className="h-screen bg-ains-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-30"></div>
              
              {/* Share Card - Designed for Screenshots */}
              <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-sm shadow-2xl relative z-10 text-center animate-fade-in border-t-4 border-t-ains-primary">
                   <div className="flex justify-center mb-6">
                        <div className="bg-ains-primary p-4 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.4)]">
                            <Trophy size={48} className="text-black" />
                        </div>
                   </div>
                   
                   <h2 className="text-3xl font-display font-bold uppercase text-white mb-2">Treino Concluído</h2>
                   <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-8">{new Date().toLocaleDateString()} • AINSFIT</p>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-black/40 p-4 rounded-sm border border-zinc-800">
                           <div className="text-ains-primary text-2xl font-bold font-mono">{Math.floor(sessionCalories)}</div>
                           <div className="text-[10px] text-zinc-500 uppercase font-bold">Calorias</div>
                       </div>
                       <div className="bg-black/40 p-4 rounded-sm border border-zinc-800">
                           <div className="text-white text-2xl font-bold font-mono">{workout.exercises.length}</div>
                           <div className="text-[10px] text-zinc-500 uppercase font-bold">Exercícios</div>
                       </div>
                   </div>

                   {newAchievements.length > 0 && (
                       <div className="mb-8 animate-bounce">
                           <div className="text-xs text-yellow-500 font-bold uppercase mb-2">Nova Conquista Desbloqueada!</div>
                           <div className="text-lg font-display text-white">{newAchievements[0]}</div>
                       </div>
                   )}

                   <div className="space-y-3">
                       <Button onClick={() => navigate('/')} fullWidth>Voltar ao Início</Button>
                       <div className="flex items-center justify-center text-zinc-600 text-xs gap-2">
                           <Camera size={14} /> <span>Tire um print para compartilhar</span>
                       </div>
                   </div>
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white relative font-sans">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <button onClick={() => { if(confirm("Sair do treino?")) { saveCurrentWorkout(null); navigate('/'); } }}><X className="text-zinc-500 hover:text-white" /></button>
          <div className="flex flex-col items-center">
              <span className="font-display font-bold uppercase tracking-widest text-zinc-400 text-xs">{isResting ? 'RECOVER' : `SET ${currentExerciseIndex + 1}/${workout.exercises.length}`}</span>
              <div className="w-24 h-1 bg-zinc-800 mt-1"><div className="bg-ains-primary h-full transition-all duration-300" style={{width: `${progress}%`}}></div></div>
          </div>
          <button onClick={() => setShowInfo(!showInfo)} className={showInfo ? 'text-ains-primary' : 'text-zinc-500'}><Info /></button>
      </div>

      {/* Info Overlay */}
      {showInfo && (
          <div className="absolute top-16 left-0 w-full bg-zinc-900/95 backdrop-blur-md z-20 p-6 border-b border-ains-primary/30 animate-fade-in shadow-xl">
              <h3 className="font-display font-bold text-xl uppercase mb-2 text-white">{currentEx.name}</h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{currentEx.description}</p>
              
              <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-ains-primary text-black text-xs font-bold uppercase">{currentEx.muscleGroup}</span>
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase">{currentEx.difficulty}</span>
              </div>

              {currentEx.musculosPrimarios && (
                  <div className="mb-2">
                      <div className="text-[10px] text-ains-primary font-bold uppercase mb-1 flex items-center gap-1"><BicepsFlexed size={12}/> Foco Principal</div>
                      <div className="flex flex-wrap gap-1">
                          {currentEx.musculosPrimarios.map(m => <span key={m} className="text-xs text-white bg-black/50 px-2 py-1 rounded border border-zinc-700">{m}</span>)}
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
          {!isResting ? (
              <>
                <div className="h-[40vh] bg-zinc-900 relative">
                    <YouTubeEmbed url={currentEx.videoUrl} title={currentEx.name} placeholder={currentEx.videoPlaceholder} />
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase flex items-center shadow-lg"><Activity size={12} className="mr-1"/> LIVE</div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-display font-bold uppercase leading-none mb-2">{currentEx.name}</h2>
                        <div className="flex items-center space-x-4 text-lg font-mono text-ains-primary">
                            <span>{currentEx.reps || `${currentEx.durationSeconds}s`}</span>
                            <span className="text-zinc-600">|</span>
                            <span>{currentEx.sets} SÉRIES</span>
                        </div>
                         <div className="mt-2 bg-zinc-900/50 w-fit px-2 py-1 rounded border border-zinc-800 text-xs text-zinc-400">
                                 Total: <span className="text-white font-bold">{Math.floor(sessionCalories)} kcal</span>
                         </div>
                    </div>
                    
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm flex items-center justify-between">
                        <span className={`text-5xl font-mono font-bold ${isActive ? 'text-white' : 'text-zinc-600'}`}>{formatTime(timer)}</span>
                        <button onClick={() => {playTone('start'); setIsActive(!isActive)}} className={`px-6 py-2 font-bold uppercase tracking-wider text-sm ${isActive ? 'bg-zinc-800 text-white' : 'bg-ains-primary text-black'}`}>
                            {isActive ? 'PAUSE' : 'START'}
                        </button>
                    </div>

                    <Button onClick={handleNext} fullWidth className="h-16 text-xl flex justify-between items-center px-6">
                        <span>PRÓXIMO</span>
                        <CheckCircle />
                    </Button>
                </div>
              </>
          ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 p-8 text-center">
                  <span className="text-zinc-500 font-bold uppercase tracking-[0.5em] mb-8">DESCANSO</span>
                  <div className="text-9xl font-mono font-bold text-white mb-8">{formatTime(timer)}</div>
                  <p className="text-zinc-400 mb-8 font-mono text-sm">PRÓXIMO: <span className="text-white">{workout.exercises[currentExerciseIndex + 1]?.name || 'FIM'}</span></p>
                  <Button onClick={handleNext} variant="outline" fullWidth>PULAR</Button>
              </div>
          )}
      </div>
    </div>
  );
};
