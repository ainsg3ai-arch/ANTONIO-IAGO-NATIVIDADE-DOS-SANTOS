import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, HabitLog, WorkoutSession, WorkoutTemplate } from '../types';
import { getProfile, getHabits, saveHabitLog, getHistory, saveCurrentWorkout, getTemplates, deleteTemplate } from '../services/storageService';
import { generateWorkoutAI, generateUUID } from '../services/aiLogic';
import { Button } from '../components/Button';
import { Droplets, Moon, Zap, RotateCcw, ChevronRight, Play, Trash2, Crown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<HabitLog>({ date: '', waterIntake: 0, sleepHours: 0, mood: 0 });
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setProfile(p);
    setTemplates(getTemplates());
    
    // Calcular progresso semanal
    const history = getHistory();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    setWeeklyProgress(history.filter(w => w.dateCreated > oneWeekAgo).length);
    
    // Hábitos
    const today = new Date().toISOString().split('T')[0];
    const habit = getHabits().find(h => h.date === today) || { date: today, waterIntake: 0, sleepHours: 7, mood: 3 };
    setHabits(habit);
  }, [navigate]);

  const updateHabit = (key: keyof HabitLog, value: number) => {
    const newHabits = { ...habits, [key]: value };
    setHabits(newHabits);
    saveHabitLog(newHabits);
  };

  const startAIWorkout = () => {
    if (!profile) return;
    const workout = generateWorkoutAI(profile);
    saveCurrentWorkout(workout);
    navigate('/workout-active');
  };

  const startTemplate = (t: WorkoutTemplate) => {
      saveCurrentWorkout({
          id: generateUUID(),
          name: t.name,
          dateCreated: Date.now(),
          exercises: [...t.exercises],
          completed: false,
          caloriesBurned: 0,
          durationTaken: 0
      });
      navigate('/workout-active');
  };

  const handleDeleteTemplate = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(confirm('Excluir este treino?')) {
          deleteTemplate(id);
          setTemplates(prev => prev.filter(t => t.id !== id));
      }
  }

  if (!profile) return null;

  return (
    <div className="p-6 space-y-8 min-h-screen bg-ains-black text-ains-text">
      {/* Header Poster Style */}
      <div className="flex justify-between items-end border-b-2 border-ains-primary/20 pb-4">
        <div>
          <h2 className="text-ains-primary text-xs font-black uppercase tracking-[0.3em] mb-1">Painel de Controle</h2>
          <h1 className="text-4xl font-display font-bold text-white uppercase leading-none">
            Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-ains-primary to-yellow-600">{profile.name}</span>
          </h1>
        </div>
        <div className="bg-zinc-900 border border-zinc-700 p-1 rounded-full">
             <Crown size={24} className="text-ains-primary" />
        </div>
      </div>

      {/* RPG Level Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm relative overflow-hidden group">
          <div className="flex justify-between items-end mb-2 relative z-10">
              <span className="font-display font-bold text-xl uppercase italic">Meta Semanal</span>
              <span className="text-ains-primary font-mono text-xl">{weeklyProgress}/{profile.workoutFrequency || 3}</span>
          </div>
          <div className="w-full bg-black h-4 rounded-sm border border-zinc-700 relative z-10">
              <div 
                className="bg-ains-primary h-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,215,0,0.5)]" 
                style={{ width: `${Math.min(100, (weeklyProgress / (profile.workoutFrequency || 3)) * 100)}%` }} 
              />
          </div>
          {/* Background FX */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-ains-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-ains-primary/10 transition-all"></div>
      </div>

      {/* Main Action Card */}
      <div className="relative bg-zinc-900 border border-zinc-700 p-8 rounded-sm overflow-hidden shadow-2xl">
          <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 bg-ains-primary/20 text-ains-primary px-3 py-1 rounded-sm mb-4">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Recomendado</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-white uppercase leading-none mb-2">Treino de {profile.workoutDuration}min</h3>
              <p className="text-zinc-400 text-sm mb-8 font-mono">Foco: {profile.goal} • Intensidade Alta</p>
              
              <Button onClick={startAIWorkout} fullWidth className="flex justify-between items-center group">
                  <span>INICIAR SESSÃO</span>
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </Button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
      </div>

      {/* Templates */}
      {templates.length > 0 && (
        <div>
            <h3 className="font-display font-bold text-lg text-white mb-4 uppercase flex items-center gap-2"><RotateCcw size={18} className="text-ains-primary"/> Meus Treinos</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                {templates.map(t => (
                    <div key={t.id} onClick={() => startTemplate(t)} className="min-w-[200px] bg-zinc-900 border border-zinc-800 p-5 rounded-sm hover:border-ains-primary cursor-pointer transition-colors relative group">
                        <button onClick={(e) => handleDeleteTemplate(e, t.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                        <h4 className="font-bold text-white uppercase truncate mb-2">{t.name}</h4>
                        <p className="text-xs text-zinc-500 font-mono mb-4">{t.exercises.length} EXERCÍCIOS</p>
                        <div className="text-ains-primary text-xs font-bold uppercase tracking-wider flex items-center">
                            <Play size={10} fill="currentColor" className="mr-2"/> GO
                        </div>
                    </div>
                ))}
                 <div onClick={() => navigate('/builder')} className="min-w-[100px] flex items-center justify-center bg-zinc-900/30 rounded-sm border-2 border-zinc-800 border-dashed cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-700 transition-all">
                        <span className="text-4xl text-zinc-700">+</span>
                </div>
            </div>
        </div>
      )}

      {/* Tracker */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-sm">
              <div className="flex justify-between mb-4">
                  <Droplets className="text-blue-500" />
                  <span className="text-2xl font-mono font-bold">{habits.waterIntake}ml</span>
              </div>
              <Button onClick={() => updateHabit('waterIntake', habits.waterIntake + 250)} variant="secondary" fullWidth className="text-xs py-2">+250ml</Button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-sm">
              <div className="flex justify-between mb-4">
                  <Moon className="text-purple-500" />
                  <span className="text-2xl font-mono font-bold">{habits.sleepHours}h</span>
              </div>
              <div className="flex gap-2">
                  <button onClick={() => updateHabit('sleepHours', Math.max(0, habits.sleepHours - 0.5))} className="flex-1 bg-zinc-800 p-2 text-white font-bold">-</button>
                  <button onClick={() => updateHabit('sleepHours', habits.sleepHours + 0.5)} className="flex-1 bg-zinc-800 p-2 text-white font-bold">+</button>
              </div>
          </div>
      </div>
    </div>
  );
};