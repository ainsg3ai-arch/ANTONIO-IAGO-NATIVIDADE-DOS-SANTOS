
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Exercise, UserRituals } from '../types';
import { getProfile, saveCurrentWorkout, getHistory, getRituals, updateRitual } from '../services/storageService';
import { generateUUID } from '../services/aiLogic';
import { QUICK_ROUTINES, EXERCISE_DATABASE } from '../constants';
import { Play, ChevronRight, Zap, Target, Flame, Trophy, Droplets, Moon, Coffee, Heart } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rituals, setRituals] = useState<UserRituals>({ water: 0, sleep: false, protein: false, meditation: false });
  const [stats, setStats] = useState({ streak: 0, total: 0 });

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
    setRituals(getRituals());
    const history = getHistory();
    setStats({ streak: history.length > 0 ? 3 : 0, total: history.length });
  }, [navigate]);

  const handleRitualClick = (key: keyof UserRituals) => {
      let newValue: any;
      if (key === 'water') {
          newValue = Math.min(8, rituals.water + 1);
      } else {
          newValue = !rituals[key];
      }
      updateRitual(key, newValue);
      setRituals(prev => ({ ...prev, [key]: newValue }));
      setProfile(getProfile()); // Refresh profile for coin update
  };

  const startRoutine = (routine: typeof QUICK_ROUTINES[0]) => {
      const selectedExs = routine.exIds.map(id => 
          EXERCISE_DATABASE.find(e => e.id === id)
      ).filter(Boolean) as Exercise[];

      saveCurrentWorkout({
          id: generateUUID(),
          name: routine.name,
          dateCreated: Date.now(),
          exercises: selectedExs,
          completed: false,
          type: 'STRENGTH'
      });
      navigate('/workout-active');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-ains-bg text-white pb-32 px-6 page-enter">
      {/* Top Bar */}
      <header className="py-10 flex justify-between items-center">
          <div>
              <p className="text-ains-muted text-[10px] font-bold uppercase tracking-widest mb-1">Elite Protocol</p>
              <h1 className="text-3xl font-display font-bold uppercase leading-none">{profile.name.split(' ')[0]}</h1>
          </div>
          <div className="flex gap-4">
              <div className="bg-ains-surface px-4 py-2 rounded-2xl text-center border border-white/5">
                  <div className="text-ains-primary font-display font-bold text-xl">{stats.streak}</div>
                  <div className="text-[8px] text-ains-muted uppercase font-black">Streak</div>
              </div>
              <div onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full border-2 border-ains-primary/20 p-1 cursor-pointer">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} className="w-full h-full rounded-full object-cover" alt="User" />
              </div>
          </div>
      </header>

      <div className="space-y-8">
          {/* Rituais Diários */}
          <section>
              <h3 className="text-[10px] font-black uppercase text-ains-muted tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Heart size={14} className="text-ains-accent" /> Rituais de Elite
              </h3>
              <div className="grid grid-cols-4 gap-3">
                  <button 
                    onClick={() => handleRitualClick('water')}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${rituals.water >= 8 ? 'bg-ains-primary border-ains-primary shadow-neon' : 'bg-ains-surface border-white/5'}`}
                  >
                      <Droplets size={20} className={rituals.water >= 8 ? 'text-ains-bg' : 'text-ains-primary'} />
                      <span className={`text-[10px] font-black mt-1 ${rituals.water >= 8 ? 'text-ains-bg' : 'text-ains-muted'}`}>{rituals.water}/8</span>
                  </button>
                  <button 
                    onClick={() => handleRitualClick('sleep')}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${rituals.sleep ? 'bg-ains-success border-ains-success shadow-success' : 'bg-ains-surface border-white/5'}`}
                  >
                      <Moon size={20} className={rituals.sleep ? 'text-ains-bg' : 'text-ains-success'} />
                      <span className={`text-[10px] font-black mt-1 ${rituals.sleep ? 'text-ains-bg' : 'text-ains-muted'}`}>SONO</span>
                  </button>
                  <button 
                    onClick={() => handleRitualClick('protein')}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${rituals.protein ? 'bg-orange-500 border-orange-500 shadow-lg' : 'bg-ains-surface border-white/5'}`}
                  >
                      <Coffee size={20} className={rituals.protein ? 'text-ains-bg' : 'text-orange-500'} />
                      <span className={`text-[10px] font-black mt-1 ${rituals.protein ? 'text-ains-bg' : 'text-ains-muted'}`}>DIETA</span>
                  </button>
                  <button 
                    onClick={() => handleRitualClick('meditation')}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${rituals.meditation ? 'bg-purple-500 border-purple-500 shadow-lg' : 'bg-ains-surface border-white/5'}`}
                  >
                      <Zap size={20} className={rituals.meditation ? 'text-ains-bg' : 'text-purple-500'} />
                      <span className={`text-[10px] font-black mt-1 ${rituals.meditation ? 'text-ains-bg' : 'text-ains-muted'}`}>FOCO</span>
                  </button>
              </div>
          </section>

          {/* Main Hero Card */}
          <div 
            onClick={() => startRoutine(QUICK_ROUTINES[0])}
            className="relative w-full aspect-[16/10] rounded-[2.5rem] bg-ains-primary text-ains-bg p-8 flex flex-col justify-end overflow-hidden group active:scale-[0.98] transition-all shadow-neon"
          >
              <div className="absolute top-4 right-6 opacity-20">
                  <Play size={120} fill="currentColor" />
              </div>
              <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-ains-bg/10 px-3 py-1 rounded-full mb-3 inline-block">Sugerido para hoje</span>
                  <h2 className="text-4xl font-display font-bold uppercase italic leading-none mb-4">Mestre da<br/>Fundação</h2>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 bg-ains-bg text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase">
                          <Zap size={14} className="text-ains-primary" /> 12 Min
                      </div>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-ains-bg">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                  </div>
              </div>
          </div>

          {/* Protocolos de Ação */}
          <div>
              <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-bold uppercase text-ains-muted flex items-center gap-2">
                    <Target size={16} /> Protocolos de Ação
                  </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                  {QUICK_ROUTINES.slice(1).map((routine) => (
                      <div 
                        key={routine.id}
                        onClick={() => startRoutine(routine)}
                        className="bg-ains-surface border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:bg-ains-card transition-colors cursor-pointer group active:scale-[0.98]"
                      >
                          <div className="flex items-center gap-5">
                              <div className={`${routine.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform`}>
                                  <routine.icon size={28} />
                              </div>
                              <div>
                                  <h4 className="font-display font-bold uppercase text-lg leading-none mb-1">{routine.name}</h4>
                                  <div className="flex gap-2 text-[10px] text-ains-muted font-bold uppercase">
                                      <span>{routine.duration}</span>
                                      <span className="text-ains-primary">•</span>
                                      <span>{routine.level}</span>
                                  </div>
                              </div>
                          </div>
                          <ChevronRight className="text-ains-muted group-hover:text-ains-primary transition-colors" />
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};
