
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock, PlayCircle, Calendar } from 'lucide-react';
import { getProfile, getProgramStatus } from '../services/storageService';
import { PROGRAM_30_DAYS } from '../constants';
import { UserProfile } from '../types';

export const Campaign: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
      setProfile(getProfile());
      const status = getProgramStatus();
      setCurrentDay(status.currentDay);
  }, []);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
        {/* Header Image */}
        <div className="relative h-64 w-full">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <button onClick={() => navigate('/')} className="mb-4 text-white/80 hover:text-white flex items-center gap-2 font-bold text-xs uppercase"><ArrowLeft size={16}/> Voltar</button>
                <span className="bg-ains-primary text-black text-[10px] font-black px-2 py-1 uppercase rounded-sm mb-2 inline-block">Plano Ativo</span>
                <h1 className="text-3xl font-display font-bold uppercase italic">{PROGRAM_30_DAYS.title}</h1>
                <p className="text-zinc-300 text-sm mt-2 max-w-xs">{PROGRAM_30_DAYS.description}</p>
            </div>
        </div>

        {/* Days Grid */}
        <div className="p-6">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-lg font-bold uppercase">Cronograma</h2>
                <span className="text-xs text-zinc-500 font-mono">DIA {currentDay} DE 30</span>
            </div>

            <div className="space-y-4">
                {PROGRAM_30_DAYS.days.map((day) => {
                    const isLocked = day.day > currentDay;
                    const isCompleted = day.day < currentDay;
                    const isCurrent = day.day === currentDay;

                    return (
                        <div key={day.day} className={`relative flex items-center p-4 rounded-xl border ${isCurrent ? 'bg-zinc-900 border-ains-primary' : 'bg-zinc-950 border-zinc-800'} ${isLocked ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="mr-4 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 font-display font-bold text-xl">
                                {isCompleted ? <CheckCircle2 className="text-green-500" /> : day.day}
                            </div>
                            
                            <div className="flex-1">
                                <h3 className={`font-bold uppercase text-sm ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>{day.title}</h3>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{day.focus}</p>
                            </div>

                            <div className="text-zinc-500">
                                {isLocked ? <Lock size={18} /> : isCompleted ? <span className="text-xs font-bold text-green-500">FEITO</span> : <PlayCircle className="text-ains-primary animate-pulse" size={24} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
