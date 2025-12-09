import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ProgramDay, ExerciseCategory, Program } from '../types';
import { getProfile, getHistory, saveCurrentWorkout, getProgramStatus, getDailyNutrition } from '../services/storageService';
import { generateUUID } from '../services/aiLogic';
import { PROGRAMS, EXERCISE_DATABASE } from '../constants';
import { Flame, Play, Activity, Dumbbell, Zap, Utensils, Bot, ChevronRight, Star, Target, Crown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [programStatus, setProgramStatus] = useState<any>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
    
    // Load Active Program Logic (Defaults to first one for demo)
    const prog = PROGRAMS[0]; 
    setActiveProgram(prog);
    setProgramStatus(getProgramStatus());
  }, [navigate]);

  const startWorkout = (workoutData: any, isProgram: boolean) => {
      saveCurrentWorkout({
          id: generateUUID(),
          name: isProgram ? `Dia ${programStatus?.currentDay}: ${workoutData?.title}` : workoutData.name,
          dateCreated: Date.now(),
          exercises: isProgram ? workoutData?.workout || [] : workoutData.exercises,
          completed: false,
          caloriesBurned: 0,
          durationTaken: 0,
          isProgramWorkout: isProgram,
          type: 'STRENGTH'
      });
      navigate('/workout-active');
  }

  const startDailyWorkout = () => {
      // Logic: Generate workout based on day of week
      const day = new Date().getDay(); // 0=Sun, 1=Mon...
      let focus = 'Full Body';
      if(day === 1) focus = 'Upper Body';
      if(day === 2) focus = 'Core & Cardio';
      
      const exs = EXERCISE_DATABASE.sort(() => 0.5 - Math.random()).slice(0, 5); // Random for demo
      
      saveCurrentWorkout({
          id: generateUUID(),
          name: `Treino de ${new Date().toLocaleDateString('pt-BR', {weekday: 'long'})}`,
          dateCreated: Date.now(),
          exercises: exs,
          completed: false,
          caloriesBurned: 0,
          durationTaken: 0,
          type: 'HIIT'
      });
      navigate('/workout-active');
  }

  if (!profile) return null;

  const currentDayData = activeProgram?.days.find(d => d.day === (programStatus?.currentDay || 1));

  return (
    <div className="min-h-screen bg-ains-bg text-white pb-32 font-sans">
      {/* 1. HEADER & LEVEL */}
      <div className="p-6 pt-10 flex justify-between items-end bg-gradient-to-b from-zinc-900 to-ains-bg border-b border-white/5 pb-8">
          <div>
              <div className="flex items-center gap-2 mb-1">
                   <div className="bg-yellow-600 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                       <Crown size={10}/> Nível {Math.floor((profile.xp || 0) / 1000) + 1}
                   </div>
                   <span className="text-zinc-500 text-[10px] font-mono">{profile.xp} XP</span>
              </div>
              <h1 className="text-3xl font-display font-bold uppercase italic text-white leading-none">
                  Olá, <span className="text-ains-primary">{profile.name.split(' ')[0]}</span>
              </h1>
          </div>
          <div onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full border-2 border-ains-primary p-1 cursor-pointer">
              <div className="w-full h-full bg-zinc-800 rounded-full flex items-center justify-center font-bold text-ains-primary text-xl">
                  {profile.name.charAt(0)}
              </div>
          </div>
      </div>

      <div className="p-6 space-y-10 animate-slide-up">
          
          {/* 2. HERO CARD: DAILY WORKOUT */}
          <div onClick={startDailyWorkout} className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
               
               <div className="absolute bottom-6 left-6 z-10">
                    <span className="text-ains-primary font-bold uppercase tracking-widest text-xs mb-1 block">Treino do Dia</span>
                    <h2 className="text-4xl font-display font-bold uppercase italic leading-none text-white drop-shadow-md">
                        {new Date().toLocaleDateString('pt-BR', {weekday: 'long'})}
                    </h2>
                    <div className="flex items-center gap-3 mt-3">
                         <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase rounded-full">45 Min</span>
                         <span className="bg-black/50 backdrop-blur text-white px-3 py-1 text-xs font-bold uppercase rounded-full border border-white/20">Full Body</span>
                    </div>
               </div>
               <div className="absolute bottom-6 right-6 z-10 bg-ains-primary text-black w-12 h-12 rounded-full flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform">
                   <Play fill="black" size={20} className="ml-1"/>
               </div>
          </div>

          {/* 3. ACTIVE PROGRAM PROGRESS */}
          <div>
              <div className="flex justify-between items-end mb-4 px-1">
                  <h3 className="text-xl font-display font-bold uppercase italic text-white">Meu Plano</h3>
                  <button onClick={() => navigate('/programs')} className="text-xs text-ains-primary font-bold uppercase">Ver Todos</button>
              </div>
              
              <div onClick={() => startWorkout(currentDayData, true)} className="bg-zinc-900 rounded-2xl p-1 border border-zinc-800 hover:border-ains-primary transition-colors cursor-pointer group">
                  <div className="flex gap-4 p-4">
                      <div className="w-20 h-20 rounded-xl bg-zinc-800 flex flex-col items-center justify-center border border-zinc-700 text-zinc-500 group-hover:text-white transition-colors">
                          <span className="text-xs font-bold uppercase">Dia</span>
                          <span className="text-3xl font-display font-bold text-white">{programStatus?.currentDay || 1}</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                           <h4 className="text-lg font-bold text-white uppercase leading-none mb-1">{currentDayData?.title || 'Descanso'}</h4>
                           <p className="text-sm text-zinc-400 mb-3">{currentDayData?.focus || 'Recuperação'}</p>
                           {/* Progress Bar */}
                           <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                               <div className="h-full bg-ains-primary w-[30%]"></div>
                           </div>
                      </div>
                      <div className="flex items-center justify-center text-zinc-500 group-hover:text-ains-primary">
                          <ChevronRight size={24} />
                      </div>
                  </div>
              </div>
          </div>

          {/* 4. CATEGORIES GRID */}
          <div>
               <h3 className="text-xl font-display font-bold uppercase italic text-white mb-4 px-1">Explorar</h3>
               <div className="grid grid-cols-2 gap-3">
                   {[
                       { cat: ExerciseCategory.PUSH, color: 'text-blue-400', label: 'Push', icon: Activity },
                       { cat: ExerciseCategory.PULL, color: 'text-yellow-400', label: 'Pull', icon: Dumbbell },
                       { cat: ExerciseCategory.LEGS, color: 'text-red-400', label: 'Legs', icon: Zap },
                       { cat: ExerciseCategory.SKILL, color: 'text-purple-400', label: 'Skills', icon: Star },
                   ].map((item) => (
                       <button key={item.label} className="bg-zinc-900 p-5 rounded-2xl border border-white/5 hover:bg-zinc-800 hover:border-white/10 text-left transition-all group relative overflow-hidden h-32 flex flex-col justify-between">
                           <item.icon className={`${item.color} group-hover:scale-110 transition-transform`} size={28}/>
                           <span className="font-display font-bold text-lg block uppercase italic text-white">{item.label}</span>
                       </button>
                   ))}
               </div>
          </div>

          {/* 5. TOOLS & AI TEASER */}
          <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/coach')} className="bg-gradient-to-br from-ains-primary/20 to-zinc-900 p-6 rounded-2xl border border-ains-primary/30 text-left">
                  <Bot size={28} className="text-ains-primary mb-3" />
                  <h3 className="font-bold text-white uppercase leading-none">Coach IA</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">Dúvidas & Dicas</p>
              </button>
              <button onClick={() => navigate('/tools')} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-left hover:bg-zinc-800">
                  <Target size={28} className="text-white mb-3" />
                  <h3 className="font-bold text-white uppercase leading-none">Ferramentas</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">1RM, IMC, Timer</p>
              </button>
          </div>
      </div>
    </div>
  );
};