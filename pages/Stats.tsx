
import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/storageService';
import { Trophy, CalendarCheck, TrendingUp } from 'lucide-react';

export const Stats: React.FC = () => {
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Calendar Logic
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthName = today.toLocaleString('pt-BR', { month: 'long' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  useEffect(() => {
    const history = getHistory();
    setTotalWorkouts(history.length);
    
    // Extract unique dates YYYY-MM-DD
    const uniqueDays = Array.from(new Set(
        history.map(h => new Date(h.dateCreated).toISOString().split('T')[0])
    ));
    setActiveDays(uniqueDays);

    // Calculate Streak (Simplified)
    let streak = 0;
    const sortedDays = uniqueDays.sort();
    // (A real streak logic would need to check consecutive days properly, keeping simple for now)
    setCurrentStreak(streak);

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
                            ? 'bg-ains-primary text-black shadow-lg shadow-lime-900/50 scale-110' 
                            : isToday 
                                ? 'bg-zinc-700 text-white border border-ains-primary'
                                : 'bg-zinc-800 text-zinc-500'
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
    <div className="p-6 min-h-screen">
       <h1 className="text-3xl font-bold text-white mb-6">Seu Progresso</h1>

       {/* Overview Cards */}
       <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Trophy size={48} /></div>
               <h3 className="text-3xl font-bold text-white">{totalWorkouts}</h3>
               <p className="text-xs text-zinc-500 uppercase font-bold mt-1">Total de Treinos</p>
           </div>
           <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><TrendingUp size={48} /></div>
               <h3 className="text-3xl font-bold text-white">{activeDays.length}</h3>
               <p className="text-xs text-zinc-500 uppercase font-bold mt-1">Dias Ativos</p>
           </div>
       </div>

       {/* Heatmap Calendar */}
       <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold capitalize flex items-center gap-2">
                    <CalendarCheck className="text-ains-primary" size={20} />
                    {monthName} {currentYear}
                </h3>
            </div>
            
            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                {['D','S','T','Q','Q','S','S'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-bold text-zinc-600 mb-2">{d}</div>
                ))}
                {renderCalendarGrid()}
            </div>

            <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-ains-primary"></div>
                    <span>Treinou</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                    <span>Descanso</span>
                </div>
            </div>
       </div>

       {/* Motivation Quote */}
       <div className="mt-8 p-6 bg-gradient-to-r from-ains-primary/10 to-transparent rounded-2xl border-l-4 border-ains-primary">
           <p className="text-zinc-300 italic">"A consistência é a chave. Não é sobre ser perfeito, é sobre aparecer todos os dias."</p>
       </div>
    </div>
  );
};
