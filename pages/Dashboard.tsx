import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ProgramDay, ExerciseCategory } from '../types';
import { getProfile, getHistory, saveCurrentWorkout, getProgramStatus } from '../services/storageService';
import { generateUUID } from '../services/aiLogic';
import { PROGRAM_30_DAYS, EXERCISE_DATABASE } from '../constants';
import { Flame, Play, ChevronRight, Activity, Dumbbell, Zap, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayProgramWorkout, setTodayProgramWorkout] = useState<ProgramDay | null>(null);
  const [lotd, setLotd] = useState<any>(null); // Workout of the Day

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
    
    // Load Program Status
    const progStatus = getProgramStatus();
    const currentDayIdx = progStatus.currentDay - 1;
    if (currentDayIdx < PROGRAM_30_DAYS.days.length) {
        setTodayProgramWorkout(PROGRAM_30_DAYS.days[currentDayIdx]);
    }

    // Generate Random Workout of the Day (LOTD)
    const randomExs = EXERCISE_DATABASE.sort(() => 0.5 - Math.random()).slice(0, 4);
    setLotd({
        name: 'Ignition Protocol',
        duration: '15 min',
        intensity: 'Alta',
        exercises: randomExs
    });

  }, [navigate]);

  const startWorkout = (workoutData: any, isProgram: boolean) => {
      saveCurrentWorkout({
          id: generateUUID(),
          name: isProgram ? `Dia ${todayProgramWorkout?.day}: ${todayProgramWorkout?.title}` : workoutData.name,
          dateCreated: Date.now(),
          exercises: isProgram ? todayProgramWorkout?.workout || [] : workoutData.exercises,
          completed: false,
          caloriesBurned: 0,
          durationTaken: 0,
          isProgramWorkout: isProgram
      });
      navigate('/workout-active');
  }

  const startCategory = (cat: ExerciseCategory) => {
      const exs = EXERCISE_DATABASE.filter(e => e.category === cat).slice(0, 5);
      saveCurrentWorkout({
          id: generateUUID(),
          name: `Treino de ${cat}`,
          dateCreated: Date.now(),
          exercises: exs,
          completed: false,
          caloriesBurned: 0,
          durationTaken: 0
      });
      navigate('/workout-active');
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-ains-bg text-white pb-32 font-sans selection:bg-ains-primary selection:text-black">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 sticky top-0 z-30 bg-ains-bg/80 backdrop-blur-md border-b border-white/5">
          <div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric', month: 'long'})}</p>
              <h1 className="text-xl font-display font-bold uppercase italic tracking-wide text-white">HELLO, <span className="text-ains-primary">{profile.name.split(' ')[0]}</span></h1>
          </div>
          <div onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-ains-surface border border-zinc-700 flex items-center justify-center font-bold text-ains-primary cursor-pointer hover:border-ains-primary transition-colors">
              {profile.name.charAt(0)}
          </div>
      </div>

      <div className="p-6 space-y-8 animate-slide-up">
          
          {/* HERO: CURRENT PROGRAM */}
          <div onClick={() => navigate('/campaign')} className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
               {/* Background Image */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-ains-bg via-ains-bg/40 to-transparent"></div>
               
               <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-wider transform -skew-x-6">Plano Ativo</span>
                        <span className="text-ains-primary text-xs font-bold uppercase tracking-wider drop-shadow-md">{PROGRAM_30_DAYS.title}</span>
                    </div>
                    <h2 className="text-4xl font-display font-bold uppercase italic leading-none mb-1 text-white text-glow">Dia {todayProgramWorkout?.day}</h2>
                    <h3 className="text-xl text-zinc-300 font-display uppercase mb-4">{todayProgramWorkout?.title}</h3>
                    
                    {todayProgramWorkout && (
                         <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-4 text-xs font-bold text-zinc-400 bg-black/40 backdrop-blur px-3 py-2 rounded-lg border border-white/5">
                                <span className="flex items-center gap-1"><Dumbbell size={14} className="text-ains-primary"/> {todayProgramWorkout.workout.length} EXERCÍCIOS</span>
                                <span className="flex items-center gap-1"><Zap size={14} className="text-ains-primary"/> {todayProgramWorkout.focus}</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); startWorkout(null, true); }}
                                className="bg-ains-primary text-black p-4 rounded-full hover:bg-white transition-colors shadow-neon"
                            >
                                <Play fill="black" size={20} className="ml-1" />
                            </button>
                        </div>
                    )}
               </div>
          </div>

          {/* STATS STRIP */}
          <div onClick={() => navigate('/stats')} className="flex items-center justify-between bg-ains-card p-4 rounded-xl border border-white/5 cursor-pointer hover:border-ains-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                  <div className="bg-ains-surface p-2 rounded-lg text-orange-500">
                      <Flame size={20} />
                  </div>
                  <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Streak Atual</div>
                      <div className="text-xl font-display font-bold text-white leading-none">{getHistory().length} <span className="text-sm text-zinc-600">SESSÕES</span></div>
                  </div>
              </div>
              <Activity className="text-ains-primary opacity-50" size={24} />
          </div>

          {/* WORKOUT OF THE DAY (LOTD) */}
          <div>
              <div className="flex justify-between items-end mb-4">
                  <h3 className="text-lg font-display font-bold uppercase italic text-white flex items-center gap-2">
                      <span className="w-1 h-5 bg-ains-primary block transform -skew-x-12"></span> Daily Challenge
                  </h3>
              </div>
              <div onClick={() => startWorkout(lotd, false)} className="group bg-gradient-to-r from-ains-card to-ains-surface border border-white/5 p-1 rounded-2xl cursor-pointer hover:border-ains-primary/30 transition-all">
                  <div className="bg-ains-bg/50 backdrop-blur p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <h4 className="font-display font-bold text-2xl uppercase italic text-white group-hover:text-ains-primary transition-colors">{lotd?.name}</h4>
                        <div className="flex gap-3 mt-2">
                            <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-zinc-300 uppercase">{lotd?.duration}</span>
                            <span className="text-[10px] font-bold bg-ains-accent/20 text-ains-accent px-2 py-1 rounded uppercase">{lotd?.intensity}</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-ains-primary group-hover:text-black group-hover:border-ains-primary transition-all">
                        <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
              </div>
          </div>

          {/* CATEGORIES GRID */}
          <div>
               <h3 className="text-lg font-display font-bold uppercase italic text-white mb-4 flex items-center gap-2">
                   <span className="w-1 h-5 bg-white block transform -skew-x-12"></span> Quick Access
               </h3>
               <div className="grid grid-cols-2 gap-3">
                   {[
                       { cat: ExerciseCategory.PUSH, color: 'text-blue-400', label: 'Push', sub: 'Chest & Triceps', icon: Activity },
                       { cat: ExerciseCategory.PULL, color: 'text-yellow-400', label: 'Pull', sub: 'Back & Biceps', icon: Dumbbell },
                       { cat: ExerciseCategory.LEGS, color: 'text-red-400', label: 'Legs', sub: 'Quads & Glutes', icon: Zap },
                       { cat: ExerciseCategory.CORE, color: 'text-green-400', label: 'Core', sub: 'Abs & Obliques', icon: Flame },
                   ].map((item) => (
                       <button key={item.label} onClick={() => startCategory(item.cat)} className="bg-ains-card p-5 rounded-2xl border border-white/5 hover:bg-ains-surface hover:border-white/10 text-left transition-all group">
                           <item.icon className={`${item.color} mb-3 group-hover:scale-110 transition-transform`} size={28}/>
                           <span className="font-display font-bold text-lg block uppercase italic text-white">{item.label}</span>
                           <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">{item.sub}</span>
                       </button>
                   ))}
               </div>
          </div>
      </div>
    </div>
  );
};