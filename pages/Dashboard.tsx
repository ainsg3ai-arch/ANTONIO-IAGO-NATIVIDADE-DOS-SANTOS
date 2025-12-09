import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ProgramDay, ExerciseCategory } from '../types';
import { getProfile, getHistory, saveCurrentWorkout, getProgramStatus, getDailyNutrition } from '../services/storageService';
import { generateUUID } from '../services/aiLogic';
import { PROGRAM_30_DAYS, EXERCISE_DATABASE } from '../constants';
import { Flame, Play, Activity, Dumbbell, Zap, Utensils, Bot, Wrench, ChevronRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayProgramWorkout, setTodayProgramWorkout] = useState<ProgramDay | null>(null);
  const [dailyCals, setDailyCals] = useState(0);

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

    // Load Nutrition Summary
    const today = new Date().toISOString().split('T')[0];
    const nLog = getDailyNutrition(today);
    const cals = nLog.items.reduce((acc, i) => acc + i.calories, 0);
    setDailyCals(cals);

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
      <div className="flex justify-between items-center p-6 sticky top-0 z-30 bg-ains-bg/90 backdrop-blur-md border-b border-white/5">
          <div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric'})}</p>
              <h1 className="text-xl font-display font-bold uppercase italic tracking-wide text-white">HELLO, <span className="text-ains-primary">{profile.name.split(' ')[0]}</span></h1>
          </div>
          <div onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-ains-surface border border-zinc-700 flex items-center justify-center font-bold text-ains-primary cursor-pointer hover:border-ains-primary transition-colors">
              {profile.name.charAt(0)}
          </div>
      </div>

      <div className="p-6 space-y-8 animate-slide-up">
          
          {/* HERO: CURRENT PROGRAM */}
          <div onClick={() => navigate('/campaign')} className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
               {/* Background Image - Calisthenics Theme */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale-[30%]"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
               
               <div className="absolute top-6 left-6">
                    <span className="bg-ains-primary text-black text-[10px] font-black px-3 py-1 uppercase tracking-wider transform -skew-x-12 inline-block shadow-neon">Plano Ativo</span>
               </div>

               <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                    <h2 className="text-6xl font-display font-bold uppercase italic leading-none mb-2 text-white drop-shadow-lg outline-text">Dia {todayProgramWorkout?.day}</h2>
                    <h3 className="text-2xl text-white font-display uppercase mb-6 flex items-center gap-2">
                        {todayProgramWorkout?.title} <ChevronRight className="text-ains-primary"/>
                    </h3>
                    
                    {todayProgramWorkout && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); startWorkout(null, true); }}
                            className="w-full bg-white text-black h-16 rounded-xl font-bold uppercase text-lg hover:bg-ains-primary transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            <Play fill="black" size={20} /> Iniciar Treino
                        </button>
                    )}
               </div>
          </div>

          {/* STATS STRIP - Modern */}
          <div className="grid grid-cols-2 gap-4">
              <div onClick={() => navigate('/stats')} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 cursor-pointer hover:border-ains-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                      <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500"><Flame size={18} /></div>
                      <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Streak</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-white leading-none">{getHistory().length} <span className="text-sm text-zinc-600">Dias</span></div>
              </div>
              
              <div onClick={() => navigate('/nutrition')} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 cursor-pointer hover:border-green-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-500/20 p-2 rounded-lg text-green-500"><Utensils size={18} /></div>
                      <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Dieta</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-white leading-none">{dailyCals} <span className="text-sm text-zinc-600">kcal</span></div>
              </div>
          </div>

          {/* QUICK ACCESS GRID */}
          <div>
               <h3 className="text-lg font-display font-bold uppercase italic text-white mb-4 flex items-center gap-2">
                   <span className="w-1 h-5 bg-ains-primary block transform -skew-x-12"></span> Categorias
               </h3>
               <div className="grid grid-cols-2 gap-3">
                   {[
                       { cat: ExerciseCategory.PUSH, color: 'text-blue-400', label: 'Push', sub: 'Peito & Tríceps', icon: Activity },
                       { cat: ExerciseCategory.PULL, color: 'text-yellow-400', label: 'Pull', sub: 'Costas & Bíceps', icon: Dumbbell },
                       { cat: ExerciseCategory.LEGS, color: 'text-red-400', label: 'Legs', sub: 'Pernas & Glúteo', icon: Zap },
                       { cat: ExerciseCategory.CORE, color: 'text-green-400', label: 'Core', sub: 'Abs & Lombar', icon: Flame },
                   ].map((item) => (
                       <button key={item.label} onClick={() => startCategory(item.cat)} className="bg-zinc-900 p-5 rounded-2xl border border-white/5 hover:bg-zinc-800 hover:border-white/10 text-left transition-all group relative overflow-hidden">
                           <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                               <item.icon size={80} />
                           </div>
                           <item.icon className={`${item.color} mb-3 group-hover:scale-110 transition-transform`} size={28}/>
                           <span className="font-display font-bold text-lg block uppercase italic text-white">{item.label}</span>
                           <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">{item.sub}</span>
                       </button>
                   ))}
               </div>
          </div>

          {/* AI COACH TEASER */}
          <button onClick={() => navigate('/coach')} className="w-full bg-gradient-to-r from-ains-primary to-blue-600 p-1 rounded-2xl group">
               <div className="bg-black rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
                   <div className="absolute inset-0 bg-ains-primary/5 group-hover:bg-ains-primary/10 transition-colors"></div>
                   <div className="relative z-10">
                       <h3 className="font-display font-bold text-xl uppercase italic text-white mb-1">Coach IA</h3>
                       <p className="text-xs text-zinc-400">Dúvidas sobre execução ou dieta?</p>
                   </div>
                   <div className="relative z-10 bg-white text-black p-3 rounded-full">
                       <Bot size={24} />
                   </div>
               </div>
          </button>
      </div>
    </div>
  );
};