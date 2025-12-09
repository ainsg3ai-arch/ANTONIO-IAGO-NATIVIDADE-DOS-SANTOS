
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWorkout, saveWorkoutSession, saveCurrentWorkout, checkAndUnlockAchievements, saveSetResult, getPersonalBest } from '../services/storageService';
import { WorkoutSession } from '../types';
import { Button } from '../components/Button';
import { VideoPlayer } from '../components/VideoPlayer';
import { speak, playTone, initAudio } from '../services/audioService';
import { X, Info, ChevronRight, ChevronLeft, AlertCircle, Wind, Trophy, Timer, Check, Pause, Play, RotateCcw, Save } from 'lucide-react';

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
  
  // Log States
  const [repsDone, setRepsDone] = useState('');
  const [currentPR, setCurrentPR] = useState(0);
  const [isNewPR, setIsNewPR] = useState(false);
  const [logSaved, setLogSaved] = useState(false);

  // Ref para o Timer para evitar problemas de stale closure do setInterval
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const w = getCurrentWorkout();
    if (!w) navigate('/');
    else { 
        setWorkout(w); 
        initAudio(); 
        setTimer(0);
    }
  }, [navigate]);

  // Carregar PR quando mudar de exercício
  useEffect(() => {
      if(workout) {
          const exId = workout.exercises[currentExerciseIndex].id;
          const best = getPersonalBest(exId);
          setCurrentPR(best);
          setIsNewPR(false);
          setLogSaved(false);
          // Suggest reps based on exercise definition
          const suggested = workout.exercises[currentExerciseIndex].reps?.split('-')[1] || workout.exercises[currentExerciseIndex].reps?.split('-')[0] || '10';
          setRepsDone(suggested.replace(/[^0-9]/g, ''));
      }
  }, [currentExerciseIndex, workout]);

  // Lógica Robusta de Timer
  useEffect(() => {
    if (isActive) {
        timerRef.current = window.setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
    } else {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Calories Logic
  useEffect(() => {
    if(isActive && !isResting && workout && timer > 0 && timer % 60 === 0) {
        const currentEx = workout.exercises[currentExerciseIndex];
        const burnRate = currentEx.caloriesPerMinute || 5;
        setSessionCalories(prev => prev + burnRate);
    }
  }, [timer, isActive, isResting, workout, currentExerciseIndex]);

  // Voice Guidance
  useEffect(() => {
    if(!workout || isFinished) return;
    const ex = workout.exercises[currentExerciseIndex];
    
    // Stop previous speech
    window.speechSynthesis.cancel();

    if (isResting) {
        speak("Descanso. Registre suas repetições.");
    } else {
        const instruction = ex.reps ? `${ex.reps} repetições de ${ex.name}` : `${ex.durationSeconds} segundos de ${ex.name}`;
        speak(instruction);
        if(ex.breathingTip) setTimeout(() => speak(ex.breathingTip || ""), 3000);
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
          caloriesBurned: sessionCalories,
          durationTaken: Math.floor(timer / 60) // Aproximação
      };
      saveWorkoutSession(completedWorkout);
      saveCurrentWorkout(null);
      checkAndUnlockAchievements();
      playTone('success');
      setIsFinished(true);
  }

  const toggleTimer = () => {
      if (!isActive) playTone('start');
      setIsActive(!isActive);
  }

  const handleNext = () => {
    playTone('beep');
    setIsActive(false);
    setTimer(0);

    if (isResting) {
        // Sai do descanso -> Vai para próximo exercício
        setIsResting(false);
        setCurrentExerciseIndex(p => p + 1);
        setIsActive(true); // Auto start next exercise? Optional. Let's start it.
    } else {
        // Sai do exercício
        // Se for o último, acaba
        if (currentExerciseIndex === workout.exercises.length - 1) {
            finishWorkout();
        } else {
            // Vai para descanso
            setIsResting(true);
            setIsActive(true); // Timer do descanso roda automático
        }
    }
  };

  const saveLog = () => {
      const reps = parseInt(repsDone);
      if(reps > 0) {
          const isRecord = saveSetResult({
              exerciseId: currentEx.id,
              date: Date.now(),
              reps: reps
          });
          
          setLogSaved(true);
          
          if(isRecord) {
              setIsNewPR(true);
              playTone('success');
              speak("Novo recorde pessoal! Parabéns.");
          }
      }
  }

  if (isFinished) {
      return (
          <div className="h-screen bg-ains-bg flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              
              <div className="w-full max-w-sm glass-panel p-8 rounded-3xl relative z-10 text-center animate-slide-up border border-ains-primary/20">
                   <div className="flex justify-center mb-6">
                        <div className="p-6 rounded-full bg-ains-primary/10 border-2 border-ains-primary shadow-neon animate-pulse-slow">
                             <Trophy size={48} className="text-ains-primary" />
                        </div>
                   </div>
                   
                   <h2 className="text-4xl font-display font-bold uppercase text-white mb-2 italic tracking-tighter">Missão<br/>Cumprida</h2>
                   <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-8">AINSFIT • {new Date().toLocaleDateString()}</p>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                           <div className="text-white text-3xl font-bold font-display italic">{Math.floor(sessionCalories)}</div>
                           <div className="text-[10px] text-ains-primary uppercase font-bold tracking-wider">Calorias</div>
                       </div>
                       <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                           <div className="text-white text-3xl font-bold font-display italic">Concluído</div>
                           <div className="text-[10px] text-ains-primary uppercase font-bold tracking-wider">Status</div>
                       </div>
                   </div>

                   <Button onClick={() => navigate('/')} fullWidth variant="primary">Voltar ao QG</Button>
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden flex flex-col">
      
      {/* 1. BACKGROUND LAYER (VIDEO) */}
      <div className="absolute inset-0 z-0">
          {!isResting ? (
             <VideoPlayer 
                url={currentEx.videoUrl} 
                title={currentEx.name} 
                placeholder={currentEx.videoPlaceholder} 
                autoPlay={isActive} // Play video only when timer is running
                isActive={!isResting}
             />
          ) : (
             // REST SCREEN BACKGROUND & LOGGING UI
             <div className="w-full h-full bg-ains-bg flex flex-col relative p-6 pt-24">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black animate-pulse-slow pointer-events-none"></div>
                 
                 {/* TIMER BIG */}
                 <div className="z-10 text-center mb-8">
                     <div className="text-[80px] font-display font-bold text-white tabular-nums tracking-tighter leading-none opacity-50">
                         {formatTime(timer)}
                     </div>
                     <div className="text-ains-primary font-bold uppercase tracking-widest text-xs">Tempo de Descanso</div>
                 </div>

                 {/* LOGGING CARD */}
                 <div className="z-20 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 p-6 rounded-3xl shadow-2xl animate-slide-up">
                     {!logSaved ? (
                         <>
                             <div className="flex justify-between items-center mb-4">
                                 <h3 className="text-white font-display uppercase italic text-xl">Registrar Série</h3>
                                 <div className="text-xs font-mono text-zinc-500">Recorde: {currentPR > 0 ? currentPR : '--'} reps</div>
                             </div>
                             
                             <div className="flex gap-4 mb-4">
                                 <div className="flex-1">
                                     <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Repetições</label>
                                     <input 
                                        type="number" 
                                        value={repsDone} 
                                        onChange={e => setRepsDone(e.target.value)}
                                        className="w-full bg-black border border-zinc-600 rounded-xl p-4 text-2xl text-white font-bold text-center focus:border-ains-primary outline-none"
                                        placeholder="0"
                                     />
                                 </div>
                                 <button onClick={saveLog} className="bg-ains-primary text-black font-bold uppercase px-6 rounded-xl hover:bg-white transition-colors shadow-neon">
                                     <Save size={24} />
                                 </button>
                             </div>
                         </>
                     ) : (
                         <div className="text-center py-4">
                             {isNewPR ? (
                                 <div className="animate-bounce">
                                     <Trophy size={48} className="text-yellow-400 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                                     <h3 className="text-2xl font-display font-bold text-white italic uppercase text-glow">Novo Recorde!</h3>
                                     <p className="text-zinc-400 text-sm mt-1">{repsDone} Repetições destruídas.</p>
                                 </div>
                             ) : (
                                 <div>
                                     <Check size={48} className="text-green-500 mx-auto mb-2" />
                                     <h3 className="text-xl font-bold text-white uppercase">Registrado!</h3>
                                     <p className="text-zinc-500 text-sm">Bom trabalho. Foco na próxima.</p>
                                 </div>
                             )}
                         </div>
                     )}
                 </div>

                 {/* NEXT EXERCISE PREVIEW */}
                 <div className="z-10 mt-auto mb-8 bg-black/40 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                     <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                         <Play size={20} className="text-white"/>
                     </div>
                     <div>
                         <span className="text-[10px] text-zinc-500 uppercase font-bold block">A Seguir</span>
                         <span className="text-lg font-display font-bold text-white uppercase italic truncate block max-w-[200px]">
                             {workout.exercises[currentExerciseIndex + 1]?.name || "Finalizar Treino"}
                         </span>
                     </div>
                 </div>
             </div>
          )}
          {/* Dark Overlay for contrast */}
          {!isResting && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>}
      </div>

      {/* 2. TOP BAR */}
      <div className="relative z-20 flex justify-between items-center p-6 pt-8">
          <button onClick={() => { if(confirm("Sair do treino?")) { saveCurrentWorkout(null); navigate('/'); } }} className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white border border-white/10 hover:bg-red-500 hover:border-red-500 transition-colors">
              <X size={20}/>
          </button>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-1 mb-1">
                 {workout.exercises.map((_, idx) => (
                     <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentExerciseIndex ? 'w-8 bg-ains-primary' : idx < currentExerciseIndex ? 'w-2 bg-ains-primary/50' : 'w-2 bg-zinc-700'}`}></div>
                 ))}
             </div>
             <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                 Ex {currentExerciseIndex + 1} / {workout.exercises.length}
             </div>
          </div>

          <button onClick={() => setShowInfo(true)} className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white border border-white/10 hover:bg-ains-primary hover:text-black hover:border-ains-primary transition-colors">
              <Info size={20}/>
          </button>
      </div>

      {/* 3. CENTER / MAIN CONTENT AREA */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-8 px-6">
          {!isResting && (
              <div className="animate-slide-up">
                  {/* Exercise Title */}
                  <h1 className="text-4xl font-display font-bold text-white uppercase italic leading-none mb-2 drop-shadow-lg">{currentEx.name}</h1>
                  
                  {/* Reps/Timer Badge */}
                  <div className="flex items-center gap-3 mb-6">
                      <div className="bg-ains-primary text-black px-4 py-1 font-black text-xl uppercase transform -skew-x-12 shadow-neon">
                          {currentEx.reps || `${currentEx.durationSeconds}s`}
                      </div>
                      <span className="text-white/80 font-bold uppercase text-sm tracking-wider shadow-black drop-shadow-md">{currentEx.sets} Séries</span>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center justify-between gap-4">
                      {/* Timer Button (Main Action) */}
                      <button 
                        onClick={toggleTimer}
                        className={`flex-1 h-20 rounded-2xl flex items-center justify-between px-6 border-2 transition-all shadow-lg active:scale-95 ${isActive ? 'bg-zinc-900/90 border-zinc-700 text-white' : 'bg-white border-white text-black'}`}
                      >
                          <div className="flex flex-col text-left">
                              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{isActive ? 'Tempo' : 'Iniciar'}</span>
                              <span className="text-3xl font-mono font-bold tracking-tighter">{formatTime(timer)}</span>
                          </div>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-red-500/20 text-red-500' : 'bg-black text-ains-primary'}`}>
                              {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1"/>}
                          </div>
                      </button>

                      {/* Next Button */}
                      <button 
                        onClick={handleNext}
                        className="h-20 w-20 bg-ains-primary rounded-2xl flex items-center justify-center text-black shadow-neon border-2 border-ains-primary hover:scale-105 active:scale-95 transition-transform"
                      >
                          <Check size={32} strokeWidth={4} />
                      </button>
                  </div>
              </div>
          )}

          {isResting && (
              <div className="w-full">
                  <Button onClick={handleNext} fullWidth className="h-16 text-lg border-2 border-white/20 bg-zinc-900 hover:bg-ains-primary hover:text-black hover:border-ains-primary transition-colors">
                      PULAR DESCANSO <ChevronRight className="ml-2"/>
                  </Button>
              </div>
          )}
      </div>

      {/* 4. BOTTOM SHEET INFO (MODAL) */}
      {showInfo && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl p-6 overflow-y-auto animate-fade-in flex flex-col">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="font-display font-bold text-3xl uppercase italic text-white">Dados Táticos</h3>
                  <button onClick={() => setShowInfo(false)} className="bg-zinc-800 p-2 rounded-full text-white hover:bg-red-500 transition-colors"><X /></button>
              </div>
              
              <div className="space-y-6 pb-12">
                   {/* Technique */}
                   <div>
                       <h4 className="font-bold text-zinc-500 uppercase text-xs mb-4 tracking-widest border-b border-zinc-800 pb-1">Execução Perfeita</h4>
                       <div className="space-y-4">
                           {currentEx.stepByStep?.map((s, i) => (
                               <div key={i} className="flex gap-4">
                                   <div className="w-6 h-6 rounded-sm bg-ains-primary flex items-center justify-center text-xs font-bold text-black shrink-0">{i+1}</div>
                                   <p className="text-sm text-zinc-300 leading-relaxed">{s}</p>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Errors */}
                   <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20">
                       <div className="flex items-center gap-2 mb-3 text-red-500 font-bold uppercase text-xs tracking-wider"><AlertCircle size={16}/> Erros Comuns</div>
                       <ul className="list-disc pl-4 text-sm text-zinc-300 space-y-2">
                           {currentEx.commonErrors?.map((e, i) => <li key={i}>{e}</li>)}
                       </ul>
                   </div>

                   {/* Breathing */}
                   <div className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20">
                       <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold uppercase text-xs tracking-wider"><Wind size={16}/> Respiração</div>
                       <p className="text-sm text-zinc-300 leading-relaxed italic">"{currentEx.breathingTip}"</p>
                  </div>
                  
                  {/* Muscles */}
                  <div>
                      <h4 className="font-bold text-zinc-500 uppercase text-xs mb-3 tracking-widest">Ativação</h4>
                      <div className="flex flex-wrap gap-2">
                          {currentEx.musculosPrimarios.map(m => (
                              <span key={m} className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded text-xs font-bold uppercase text-white">{m}</span>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
