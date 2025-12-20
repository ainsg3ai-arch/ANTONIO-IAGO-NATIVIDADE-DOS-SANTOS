import React, { useEffect, useState } from 'react';
import { getHistory, getMuscleVolumeStats } from '../services/storageService';
import { Trophy, CalendarCheck, TrendingUp, Activity } from 'lucide-react';
import { MuscleGroup } from '../types';

export const Stats: React.FC = () => {
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [muscleVolume, setMuscleVolume] = useState<Record<string, number>>({});

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthName = today.toLocaleString('pt-BR', { month: 'long' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  useEffect(() => {
    const history = getHistory();
    setTotalWorkouts(history.length);
    
    const uniqueDays = Array.from(new Set(
        history.map(h => new Date(h.dateCreated).toISOString().split('T')[0])
    ));
    setActiveDays(uniqueDays);
    setMuscleVolume(getMuscleVolumeStats());
  }, []);

  const renderCalendarGrid = () => {
      const grid = [];
      for (let i = 1; i <= daysInMonth; i++) {
          const dayDate = new Date(currentYear, currentMonth, i).toISOString().split('T')[0];
          const hasWorkout = activeDays.includes(dayDate);
          const isToday = dayDate === new Date().toISOString().split('T')[0];
          
          grid.push(
              <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all 
                        ${hasWorkout 
                            ? 'bg-ains-primary text-ains-bg shadow-neon scale-110' 
                            : isToday 
                                ? 'bg-zinc-700 text-white border border-ains-primary'
                                : 'bg-ains-surface text-ains-muted'
                        }
                    `}
                  >
                      {i}
                  </div>
              </div>
          );
      }
      return grid;
  }

  return (
    <div className="p-6 min-h-screen pb-32 bg-ains-bg text-white font-sans page-enter">
       <div className="pt-6 mb-8">
          <p className="text-ains-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Análise de Dados</p>
          <h1 className="text-4xl font-display font-bold uppercase italic tracking-tighter">Status Atleta</h1>
       </div>

       {/* Heatmap Muscular Simplificado */}
       <div className="bg-ains-surface p-6 rounded-[2rem] border border-white/5 mb-8 relative overflow-hidden">
            <h3 className="text-xs font-black uppercase text-ains-muted tracking-widest mb-6 flex items-center gap-2">
                <Activity size={16} className="text-ains-primary" /> Volume Semanal (Séries)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Fix: Explicitly cast Object.entries to [string, number][] to resolve 'unknown' type errors for 'sets' */}
                {(Object.entries(muscleVolume) as [string, number][]).map(([muscle, sets]) => (
                    <div key={muscle} className="space-y-1">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">{muscle}</span>
                            <span className="text-xs font-display font-bold text-white">{sets}</span>
                        </div>
                        <div className="h-1.5 w-full bg-ains-bg rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${sets > 15 ? 'bg-ains-accent shadow-[0_0_10px_red]' : sets > 8 ? 'bg-ains-primary shadow-neon' : 'bg-ains-success shadow-success'}`} 
                                style={{width: `${Math.min(100, (sets / 20) * 100)}%`}}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                <span>🟢 Recuperado</span>
                <span>🔵 Em Evolução</span>
                <span>🔴 Fadigado</span>
            </div>
       </div>

       {/* Overview Cards */}
       <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-ains-surface p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Trophy size={48} /></div>
               <h3 className="text-3xl font-display font-bold text-white">{totalWorkouts}</h3>
               <p className="text-[10px] text-ains-muted uppercase font-black tracking-widest mt-1">Total Treinos</p>
           </div>
           <div className="bg-ains-surface p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp size={48} /></div>
               <h3 className="text-3xl font-display font-bold text-white">{activeDays.length}</h3>
               <p className="text-[10px] text-ains-muted uppercase font-black tracking-widest mt-1">Dias Ativos</p>
           </div>
       </div>

       {/* Heatmap Calendar */}
       <div className="bg-ains-surface p-8 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-display font-bold uppercase italic flex items-center gap-2">
                    <CalendarCheck className="text-ains-primary" size={20} />
                    {monthName} {currentYear}
                </h3>
            </div>
            
            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                {['D','S','T','Q','Q','S','S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-black text-ains-muted mb-2">{d}</div>
                ))}
                {renderCalendarGrid()}
            </div>
       </div>
    </div>
  );
};