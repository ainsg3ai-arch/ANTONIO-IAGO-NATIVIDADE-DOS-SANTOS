
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements } from '../services/storageService';
import { WorkoutSession, Exercise } from '../types';
import { Button } from '../components/Button';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { speak, playTone, initAudio } from '../services/audioService';
import { Timer, CheckCircle, ChevronRight, X, Info, Youtube, ExternalLink, Music, Trophy, Flame, Activity } from 'lucide-react';

export const WorkoutPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState<string[]>([]);
  const [sessionCalories, setSessionCalories] = useState(0);

  useEffect(() => {
    const w = getCurrentWorkout();
    if (!w) {
      navigate('/');
    } else {
        setWorkout(w);
        initAudio(); 
    }
  }, [navigate]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // --- Calculate Calories in Real Time ---
  useEffect(() => {
    if(isActive && !isResting && workout && timer > 0 && timer % 60 === 0) {
        // Every minute, add calorie burn estimate
        const currentEx = workout.exercises[currentExerciseIndex];
        const burnRate = currentEx.caloriesPerMinute || 5;
        setSessionCalories(prev => prev + burnRate);
    }
  }, [timer, isActive, isResting, workout, currentExerciseIndex]);


  // --- Sound Effects Logic (Countdown) ---
  useEffect(() => {
      if(!workout) return;
      const currentEx = workout.exercises[currentExerciseIndex];
      if (!isResting && currentEx.durationSeconds && isActive) {
          const remaining = currentEx.durationSeconds - timer;
          if (remaining > 0 && remaining <= 3) {
              playTone('beep');
          }
      }
  }, [timer, isResting, isActive, workout, currentExerciseIndex]);


  // --- Voice Coach Logic ---
  useEffect(() => {
    if(!workout) return;

    if (isResting) {
        speak("Descanso. Respire fundo.");
    } else {
        const ex = workout.exercises[currentExerciseIndex];
        setTimeout(() => {
            const instructions = ex.sets ? `${ex.sets} séries.` : `${ex.durationSeconds} segundos.`;
            speak(`${ex.name}. ${instructions}`);
        }, 500);
    }
  }, [currentExerciseIndex, isResting, workout]);

  if (!workout) return null;

  const currentExercise: Exercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  const displayProgress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
      if (!isActive) playTone('start');
      setIsActive(!isActive);
  }

  const handleNext = () => {
    playTone('start');
    setIsActive(false);
    
    // Add partial calories for remaining seconds (< 1 min)
    if (!isResting) {
        const burnRate = currentExercise.caloriesPerMinute || 5;
        const additionalCals = Math.floor((timer % 60) / 60 * burnRate);
        setSessionCalories(prev => prev + additionalCals);
    }

    setTimer(0);
    
    if (isResting) {
        setIsResting(false);
        setCurrentExerciseIndex(prev => prev + 1);
    } else {
        if (isLastExercise) {
            finishWorkout();
        } else {
            setIsResting(true);
            setIsActive(true);
        }
    }
  };

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
    
    const newAchievements = checkAndUnlockAchievements();
    if (newAchievements.length > 0) {
        playTone('success');
        speak("Treino concluído. Novas conquistas!");
        setShowAchievementModal(newAchievements);
    } else {
        playTone('success');
        speak("Treino finalizado com sucesso.");
        navigate('/');
    }
  };

  const closeAchievementModal = () => navigate('/');
  const quitWorkout = () => {
      if(window.confirm("Sair do treino?")) {
          saveCurrentWorkout(null);
          navigate('/');
      }
  }

  const openVideoExternal = () => window.open(currentExercise.videoUrl, '_blank');
  const openMusicApp = (url: string) => {
      window.open(url, '_blank');
      setShowMusicMenu(false);
  };

  return (
    <div className="h-screen flex flex-col bg-ains-black relative">
      {/* Achievement Modal */}
      {showAchievementModal.length > 0 && (
          <div className="absolute inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="bg-yellow-500/20 p-12 rounded-full mb-6 animate-bounce">
                  <Trophy size={80} className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Conquista!</h2>
              <div className="space-y-2 mb-8">{showAchievementModal.map(ach => <p key={ach} className="text-xl text-ains-primary font-bold">{ach}</p>)}</div>
              <Button onClick={closeAchievementModal} fullWidth>Continuar</Button>
          </div>
      )}

      {/* Info Modal */}
      {showInfo && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 w-full max-w-sm animate-fade-in">
                  <h3 className="text-xl font-bold text-white mb-2">{currentExercise.name}</h3>
                  <p className="text-zinc-400 mb-4">{currentExercise.description}</p>
                  
                  {/* Anatomy Tags */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-start">
                        <span className="text-xs text-zinc-500 w-20 font-bold uppercase mt-1">Primário</span>
                        <span className="px-2 py-1 rounded bg-ains-primary text-black text-xs font-bold">{currentExercise.muscleGroup}</span>
                    </div>
                    {currentExercise.secondaryMuscles && currentExercise.secondaryMuscles.length > 0 && (
                        <div className="flex items-start">
                            <span className="text-xs text-zinc-500 w-20 font-bold uppercase mt-1">Auxiliar</span>
                            <div className="flex flex-wrap gap-1">
                                {currentExercise.secondaryMuscles.map(m => (
                                    <span key={m} className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs">{m}</span>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button onClick={openVideoExternal} variant="secondary" fullWidth className="flex items-center justify-center space-x-2">
                        <ExternalLink size={20} />
                        <span>Abrir no YouTube</span>
                    </Button>
                    <Button onClick={() => setShowInfo(false)} fullWidth>Entendi</Button>
                  </div>
              </div>
          </div>
      )}

      {/* Music Menu */}
      {showMusicMenu && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 w-full max-w-sm animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">Música</h3>
                      <button onClick={() => setShowMusicMenu(false)} className="text-zinc-400"><X size={20}/></button>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => openMusicApp('https://open.spotify.com')} className="w-full p-4 rounded-xl bg-[#1DB954] text-black font-bold flex items-center justify-center space-x-2"><span>Spotify</span></button>
                    <button onClick={() => openMusicApp('https://music.youtube.com')} className="w-full p-4 rounded-xl bg-[#FF0000] text-white font-bold flex items-center justify-center space-x-2"><span>YouTube Music</span></button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex flex-col z-10 bg-zinc-900/50 backdrop-blur border-b border-zinc-800">
        <div className="p-4 flex justify-between items-center">
            <button onClick={quitWorkout} className="text-zinc-400 hover:text-white"><X /></button>
            <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                    {isResting ? 'DESCANSO' : `EXERCÍCIO ${currentExerciseIndex + 1}/${workout.exercises.length}`}
                </span>
                <span className="text-[10px] text-ains-primary font-bold">
                    {Math.round(displayProgress)}%
                </span>
            </div>
            <div className="flex space-x-4">
                <button onClick={() => setShowMusicMenu(true)} className="text-zinc-400 hover:text-ains-primary"><Music size={24} /></button>
                <button onClick={() => setShowInfo(true)} className="text-ains-primary"><Info size={24} /></button>
            </div>
        </div>
        <div className="w-full bg-zinc-800 h-1">
            <div className="bg-ains-primary h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(163,230,53,0.5)]" style={{ width: `${displayProgress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {!isResting ? (
            <>
                <div className="h-[35vh] w-full bg-black shrink-0 relative group">
                    <YouTubeEmbed 
                        url={currentExercise.videoUrl} 
                        title={currentExercise.name}
                        placeholder={currentExercise.videoPlaceholder}
                        key={currentExercise.id} 
                    />
                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center">
                        <Activity size={12} className="mr-1 text-red-500" />
                        ONLINE
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between bg-ains-black">
                    <div>
                        <h2 className="text-2xl font-bold text-white uppercase leading-tight mb-2">{currentExercise.name}</h2>
                        
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-ains-primary font-bold text-lg">{currentExercise.reps || `${currentExercise.durationSeconds}s`}</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-white font-bold">{currentExercise.sets} Séries</span>
                            <span className="text-zinc-600">|</span>
                            <div className="flex items-center text-orange-500 text-xs font-bold">
                                <Flame size={14} className="mr-1" />
                                ~{currentExercise.caloriesPerMinute || 5} kcal/min
                            </div>
                        </div>

                        {/* Real-time Stats Badge */}
                        <div className="flex space-x-2 mb-4">
                             <div className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400">
                                 Total: <span className="text-white font-bold">{sessionCalories} kcal</span>
                             </div>
                             <div className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400">
                                 Foco: <span className="text-ains-primary font-bold">{currentExercise.muscleGroup}</span>
                             </div>
                        </div>

                        <p className="text-zinc-400 text-sm line-clamp-2">{currentExercise.description}</p>
                    </div>

                    <div className="mt-2 space-y-4">
                        <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                            <div className="flex items-center space-x-3">
                                <Timer className="text-zinc-400" />
                                <span className={`text-3xl font-mono tracking-widest ${isActive && currentExercise.durationSeconds && (currentExercise.durationSeconds - timer <= 5) ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                    {formatTime(timer)}
                                </span>
                            </div>
                            <button onClick={toggleTimer} className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider transition-colors ${isActive ? 'bg-zinc-800 text-red-400' : 'bg-ains-primary text-black'}`}>
                                {isActive ? 'Pausar' : 'Iniciar'}
                            </button>
                        </div>
                        <Button onClick={handleNext} fullWidth className="h-14 text-lg flex justify-between items-center px-8 shadow-lg shadow-lime-900/10">
                            <span>Próximo</span>
                            <CheckCircle />
                        </Button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 bg-zinc-900">
                <div className="animate-pulse">
                    <h3 className="text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4">Tempo de Descanso</h3>
                    <div className="text-8xl font-mono font-bold text-white mb-2">{formatTime(timer)}</div>
                </div>
                <div className="space-y-4 w-full max-w-xs">
                    <p className="text-zinc-400 text-sm">A seguir: <strong className="text-ains-primary">{workout.exercises[currentExerciseIndex + 1]?.name || "Finalizar"}</strong></p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden"><div className="bg-zinc-600 h-full" style={{ width: `${displayProgress}%` }}></div></div>
                    <Button onClick={handleNext} variant="outline" fullWidth>Pular Descanso</Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
