import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements } from '../services/storageService';
import { WorkoutSession, Exercise } from '../types';
import { Button } from '../components/Button';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { speak, playTone, initAudio } from '../services/audioService';
import { Timer, CheckCircle, X, Info, Music, Flame, Activity, Trophy } from 'lucide-react';

export const WorkoutPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState<string[]>([]);
  const [sessionCalories, setSessionCalories] = useState(0);

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
    if(!workout) return;
    const ex = workout.exercises[currentExerciseIndex];
    if (isResting) speak("Descanso.");
    else setTimeout(() => speak(ex.name), 500);
  }, [currentExerciseIndex, isResting]);

  if (!workout) return null;
  const currentEx = workout.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

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
                setShowAchievementModal(newAchievements);
            } else {
                playTone('success');
                speak("Treino finalizado.");
                navigate('/');
            }
        } else {
            setIsResting(true);
            setIsActive(true);
        }
    }
  };

  const closeAchievementModal = () => navigate('/');

  return (
    <div className="h-screen flex flex-col bg-black text-white relative font-sans">
       {/* Achievement Modal */}
      {showAchievementModal.length > 0 && (
          <div className="absolute inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="bg-yellow-500/20 p-12 rounded-full mb-6 animate-bounce">
                  <Trophy size={80} className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Conquista!</h2>
              <div className="space-y-2 mb-8">{showAchievementModal.map(ach => <p key={ach} className="text-xl text-ains-primary font-bold uppercase">{ach}</p>)}</div>
              <Button onClick={closeAchievementModal} fullWidth>Continuar</Button>
          </div>
      )}

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
          <div className="absolute top-16 left-0 w-full bg-zinc-900/95 backdrop-blur-md z-20 p-6 border-b border-ains-primary/30 animate-fade-in">
              <h3 className="font-display font-bold text-xl uppercase mb-2 text-white">{currentEx.name}</h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{currentEx.description}</p>
              <div className="flex gap-2">
                  <span className="px-2 py-1 bg-ains-primary text-black text-xs font-bold uppercase">{currentEx.muscleGroup}</span>
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase">{currentEx.difficulty}</span>
              </div>
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