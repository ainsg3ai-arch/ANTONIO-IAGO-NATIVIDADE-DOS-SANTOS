
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements } from '../services/storageService';
import { WorkoutSession, Exercise } from '../types';
import { Button } from '../components/Button';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { speak, playTone, initAudio } from '../services/audioService';
import { Timer, CheckCircle, ChevronRight, X, Info, Youtube, ExternalLink, Music, Trophy } from 'lucide-react';

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

  useEffect(() => {
    const w = getCurrentWorkout();
    if (!w) {
      navigate('/');
    } else {
        setWorkout(w);
        // Initialize audio context on user gesture (simulated here on load as they clicked start previously)
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

  // --- Sound Effects Logic (Countdown) ---
  useEffect(() => {
      if(!workout) return;
      
      const currentEx = workout.exercises[currentExerciseIndex];
      
      // If we are in an exercise with duration (like Plank or Cardio)
      if (!isResting && currentEx.durationSeconds && isActive) {
          const remaining = currentEx.durationSeconds - timer;
          if (remaining > 0 && remaining <= 3) {
              playTone('beep');
          }
      }
      // Note: For rest, since we count up without a specific limit, we don't beep unless we enforce a limit.
      // Let's keep it simple for now as per user request for "professional effects".
  }, [timer, isResting, isActive, workout, currentExerciseIndex]);


  // --- Voice Coach Logic ---
  useEffect(() => {
    if(!workout) return;

    if (isResting) {
        speak("Descanso. Respire fundo e prepare-se.");
    } else {
        const ex = workout.exercises[currentExerciseIndex];
        // Short delay to allow video to load visually before speaking
        setTimeout(() => {
            const instructions = ex.sets ? `${ex.sets} séries.` : `${ex.durationSeconds} segundos.`;
            speak(`${ex.name}. ${instructions} ${ex.description}`);
        }, 500);
    }
  }, [currentExerciseIndex, isResting, workout]);

  if (!workout) return null;

  const currentExercise: Exercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
      if (!isActive) {
          playTone('start');
      }
      setIsActive(!isActive);
  }

  const handleNext = () => {
    playTone('start'); // Sound feedback on transition
    setIsActive(false);
    setTimer(0);
    
    if (isResting) {
        // Finishing rest, start next exercise
        setIsResting(false);
        setCurrentExerciseIndex(prev => prev + 1);
    } else {
        // Finished exercise set, start rest
        if (isLastExercise) {
            finishWorkout();
        } else {
            setIsResting(true);
            setIsActive(true); // Auto start rest timer
        }
    }
  };

  const finishWorkout = () => {
    const completedWorkout = { ...workout, completed: true, dateCreated: Date.now() };
    saveWorkoutSession(completedWorkout);
    saveCurrentWorkout(null); // Clear active
    
    // Check achievements
    const newAchievements = checkAndUnlockAchievements();
    if (newAchievements.length > 0) {
        playTone('success');
        speak("Parabéns! Você desbloqueou novas conquistas!");
        setShowAchievementModal(newAchievements);
    } else {
        playTone('success');
        speak("Treino concluído. Bom trabalho!");
        navigate('/');
    }
  };

  const closeAchievementModal = () => {
      navigate('/');
  }

  const quitWorkout = () => {
      if(window.confirm("Sair do treino? O progresso será perdido.")) {
          saveCurrentWorkout(null);
          navigate('/');
      }
  }

  const openVideoExternal = () => {
      window.open(currentExercise.videoUrl, '_blank');
  }

  const openMusicApp = (url: string) => {
      window.open(url, '_blank');
      setShowMusicMenu(false);
  };

  return (
    <div className="h-screen flex flex-col bg-ains-black relative">
      {/* Achievement Celebration Modal */}
      {showAchievementModal.length > 0 && (
          <div className="absolute inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-12 rounded-full mb-6 animate-bounce">
                  <Trophy size={80} className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Conquista Desbloqueada!</h2>
              <div className="space-y-2 mb-8">
                  {showAchievementModal.map(ach => (
                      <p key={ach} className="text-xl text-ains-primary font-bold">{ach}</p>
                  ))}
              </div>
              <Button onClick={closeAchievementModal} fullWidth>Continuar</Button>
          </div>
      )}

      {/* Overlay Info Modal */}
      {showInfo && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 w-full max-w-sm animate-fade-in">
                  <h3 className="text-xl font-bold text-white mb-2">{currentExercise.name}</h3>
                  <p className="text-zinc-400 mb-4">{currentExercise.description}</p>
                  <ul className="space-y-2 text-sm text-zinc-300 mb-6">
                      <li className="flex justify-between"><span>Músculo:</span> <span className="text-white">{currentExercise.muscleGroup}</span></li>
                      <li className="flex justify-between"><span>Dificuldade:</span> <span className="text-white">{currentExercise.difficulty}</span></li>
                  </ul>
                  <div className="space-y-3">
                    <Button onClick={openVideoExternal} variant="secondary" fullWidth className="flex items-center justify-center space-x-2">
                        <ExternalLink size={20} />
                        <span>Abrir no App do YouTube</span>
                    </Button>
                    <Button onClick={() => setShowInfo(false)} fullWidth>Entendi</Button>
                  </div>
              </div>
          </div>
      )}

      {/* Music Menu Overlay */}
      {showMusicMenu && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 w-full max-w-sm animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">Trilha Sonora</h3>
                      <button onClick={() => setShowMusicMenu(false)} className="text-zinc-400"><X size={20}/></button>
                  </div>
                  <p className="text-zinc-400 text-sm mb-6">Escolha seu app para tocar música em segundo plano enquanto treina.</p>
                  
                  <div className="space-y-3">
                    <button onClick={() => openMusicApp('https://open.spotify.com')} className="w-full p-4 rounded-xl bg-[#1DB954] text-black font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
                        <span>Spotify</span>
                    </button>
                    <button onClick={() => openMusicApp('https://music.youtube.com')} className="w-full p-4 rounded-xl bg-[#FF0000] text-white font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
                        <span>YouTube Music</span>
                    </button>
                    <button onClick={() => openMusicApp('https://music.apple.com')} className="w-full p-4 rounded-xl bg-[#FA243C] text-white font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
                        <span>Apple Music</span>
                    </button>
                     <button onClick={() => openMusicApp('https://www.deezer.com')} className="w-full p-4 rounded-xl bg-[#FEAA2D] text-black font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
                        <span>Deezer</span>
                    </button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-zinc-900/50 backdrop-blur border-b border-zinc-800 z-10">
        <button onClick={quitWorkout} className="text-zinc-400 hover:text-white"><X /></button>
        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
            {isResting ? 'DESCANSO' : `EXERCÍCIO ${currentExerciseIndex + 1}/${workout.exercises.length}`}
        </span>
        <div className="flex space-x-4">
            <button onClick={() => setShowMusicMenu(true)} className="text-zinc-400 hover:text-ains-primary"><Music size={24} /></button>
            <button onClick={() => setShowInfo(true)} className="text-ains-primary"><Info size={24} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {!isResting ? (
            <>
                {/* Video Area - Fixed Height for visual stability */}
                <div className="h-[40vh] w-full bg-black shrink-0">
                    <YouTubeEmbed 
                        url={currentExercise.videoUrl} 
                        title={currentExercise.name}
                        placeholder={currentExercise.videoPlaceholder}
                        // Reset autoplay state when exercise changes by using key
                        key={currentExercise.id} 
                    />
                </div>

                {/* Info & Controls */}
                <div className="flex-1 p-6 flex flex-col justify-between bg-ains-black">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                             <h2 className="text-2xl font-bold text-white uppercase leading-tight">{currentExercise.name}</h2>
                        </div>
                        <p className="text-ains-primary font-medium text-lg mb-4">
                            {currentExercise.reps || `${currentExercise.durationSeconds}s`} <span className="text-zinc-500 mx-2">•</span> {currentExercise.sets} Séries
                        </p>
                        <p className="text-zinc-400 text-sm line-clamp-3">{currentExercise.description}</p>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                            <div className="flex items-center space-x-3">
                                <Timer className="text-zinc-400" />
                                <span className={`text-3xl font-mono tracking-widest ${isActive && currentExercise.durationSeconds && (currentExercise.durationSeconds - timer <= 5) ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                    {formatTime(timer)}
                                </span>
                            </div>
                            <button 
                                onClick={toggleTimer} 
                                className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider transition-colors ${isActive ? 'bg-zinc-800 text-red-400' : 'bg-ains-primary text-black'}`}
                            >
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
            // Rest Screen
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 bg-zinc-900">
                <div className="animate-pulse">
                    <h3 className="text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4">Tempo de Descanso</h3>
                    <div className="text-8xl font-mono font-bold text-white mb-2">{formatTime(timer)}</div>
                </div>
                
                <div className="space-y-4 w-full max-w-xs">
                    <p className="text-zinc-400 text-sm">A seguir: <strong className="text-ains-primary">{workout.exercises[currentExerciseIndex + 1]?.name || "Finalizar Treino"}</strong></p>
                    <Button onClick={handleNext} variant="outline" fullWidth>Pular Descanso</Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
