
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Exercise } from '../types';
import { getProfile, saveCurrentWorkout, getHistory } from '../services/storageService';
import { generateUUID } from '../services/aiLogic';
import { QUICK_ROUTINES, EXERCISE_DATABASE } from '../constants';
import { Play, ChevronRight, Zap, Target, Flame, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ streak: 0, totalWorkouts: 0 });

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
    
    const history = getHistory();
    setStats({ 
        streak: history.length > 0 ? Math.min(history.length, 7) : 0, 
        totalWorkouts: history.length 
    });
  }, [navigate]);

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
    <div className="min-h-screen bg-ains-bg text-white pb-32 animate-fade-in">
      {/* Header Minimalista */}
      <div className="p-6 pt-10 flex justify-between items-center">
          <div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status Atleta</p>
              <h1 className="text-3xl font-display font-bold uppercase italic leading-none">{profile.name.split(' ')[0]}</h1>
          </div>
          <div className="flex gap-4">
              <div className="text-center">
                  <div className="text-ains-primary font-display font-bold text-xl">{stats.streak}</div>
                  <div className="text-[8px] text-zinc-600 uppercase font-black">Streak</div>
              </div>
              <div onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt="Avatar" />
              </div>
          </div>
      </div>

      <div className="px-6 space-y-6">
          {/* Card de Treino do Dia - Grande e Direto */}
          <div 
            onClick={() => startRoutine(QUICK_ROUTINES[0])}
            className="relative w-full p-8 rounded-[2rem] bg-ains-primary text-black shadow-neon overflow-hidden group cursor-pointer active:scale-95 transition-all"
          >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Play size={100} fill="black" />
              </div>
              <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-2 py-0.5 rounded">Recomendado</span>
                  <h2 className="text-4xl font-display font-bold uppercase italic mt-1 leading-none">Treino do Dia</h2>
                  <div className="flex gap-3 mt-4">
                      <div className="flex items-center gap-1 bg-black/80 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase">
                          <Zap size={12}/> 12 MIN
                      </div>
                      <div className="flex items-center gap-1 bg-black/80 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase">
                          Iniciante
                      </div>
                  </div>
              </div>
          </div>

          {/* Lista de Rotinas - Cards Estilo Home Workout */}
          <div>
              <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4 flex items-center gap-2">
                  <Target size={16} /> Rotinas Rápidas
              </h3>
              <div className="space-y-3">
                  {QUICK_ROUTINES.slice(1).map((routine) => (
                      <div 
                        key={routine.id}
                        onClick={() => startRoutine(routine)}
                        className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl hover:border-ains-primary transition-all cursor-pointer group active:bg-zinc-800"
                      >
                          <div className="flex items-center gap-4">
                              <div className={`${routine.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                  <routine.icon size={24} className="text-white" />
                              </div>
                              <div>
                                  <h4 className="font-bold uppercase text-sm leading-none mb-1">{routine.name}</h4>
                                  <div className="flex gap-2 text-[10px] text-zinc-500 font-bold uppercase">
                                      <span>{routine.duration}</span>
                                      <span>•</span>
                                      <span>{routine.level}</span>
                                  </div>
                              </div>
                          </div>
                          <ChevronRight className="text-zinc-800 group-hover:text-ains-primary transition-all" />
                      </div>
                  ))}
              </div>
          </div>

          {/* Seção de Planos 30 Dias */}
          <div 
            onClick={() => navigate('/campaign')}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors"
          >
              <div className="flex items-center gap-4">
                  <div className="bg-orange-500/10 p-3 rounded-full">
                    <Calendar className="text-orange-500" size={24}/>
                  </div>
                  <div>
                      <h4 className="font-bold uppercase text-sm">Desafio 30 Dias</h4>
                      <p className="text-[10px] text-zinc-500 uppercase">Evolução progressiva</p>
                  </div>
              </div>
              <ChevronRight className="text-zinc-700" />
          </div>

          {/* Status Simples */}
          <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-900 grid grid-cols-2 gap-4">
              <div className="text-center border-r border-zinc-900">
                  <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Treinos Feitos</div>
                  <div className="text-xl font-display font-bold">{stats.totalWorkouts}</div>
              </div>
              <div className="text-center">
                  <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Nível IA</div>
                  <div className="text-xl font-display font-bold text-ains-primary">{Math.floor(profile.xp / 1000) + 1}</div>
              </div>
          </div>
      </div>
    </div>
  );
};
