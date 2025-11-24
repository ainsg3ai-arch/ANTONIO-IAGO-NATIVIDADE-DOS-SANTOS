
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, HabitLog, WorkoutSession } from '../types';
import { getProfile, getHabits, saveHabitLog, getHistory, saveCurrentWorkout } from '../services/storageService';
import { generateWorkoutAI, generateUUID } from '../services/aiLogic';
import { Button } from '../components/Button';
import { Droplets, Moon, Zap, Flame, RotateCcw, ChevronRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<HabitLog>({
    date: new Date().toISOString().split('T')[0],
    waterIntake: 0,
    sleepHours: 7,
    mood: 3
  });
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      navigate('/onboarding');
      return;
    }
    setProfile(p);
    
    // Load today's habits if exist
    const allHabits = getHabits();
    const today = new Date().toISOString().split('T')[0];
    const todayLog = allHabits.find(h => h.date === today);
    if (todayLog) setHabits(todayLog);

    // Load History
    const history = getHistory();
    setRecentWorkouts(history.slice(-3).reverse());
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

  const repeatLastWorkout = () => {
      if(recentWorkouts.length > 0) {
          const last = recentWorkouts[0]; // Most recent is first in this array
          const newSession: WorkoutSession = {
              ...last,
              id: generateUUID(),
              dateCreated: Date.now(),
              completed: false,
              exercises: last.exercises.map(e => ({...e})) // Shallow copy exercises
          };
          saveCurrentWorkout(newSession);
          navigate('/workout-active');
      }
  }

  if (!profile) return null;

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-ains-muted text-sm font-medium uppercase tracking-wider">Bem-vindo de volta</h2>
          <h1 className="text-3xl font-bold text-white mt-1">Pronto para treinar,<br/> <span className="text-ains-primary">{profile.name}?</span></h1>
        </div>
        <div className="bg-zinc-800 p-2 rounded-full">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="avatar" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="space-y-4">
        {/* Recommended Card */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-6 border border-zinc-700 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ains-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center space-x-2 text-ains-primary mb-2">
                    <Zap size={20} fill="currentColor" />
                    <span className="font-bold tracking-wide">RECOMENDAÇÃO DA IA</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Plano Diário de {profile.goal}</h3>
                <p className="text-zinc-400 mb-6 text-sm">Com base na sua atividade recente e objetivo, preparamos uma sessão personalizada.</p>
                
                <Button onClick={startAIWorkout} fullWidth className="flex justify-between items-center group">
                    <span>Iniciar Novo Treino</span>
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>

        {/* Repeat Last Workout Shortcut */}
        {recentWorkouts.length > 0 && (
            <button 
                onClick={repeatLastWorkout}
                className="w-full bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between hover:border-zinc-600 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    <div className="bg-zinc-800 p-3 rounded-xl text-zinc-400">
                        <RotateCcw size={20} />
                    </div>
                    <div className="text-left">
                        <span className="text-xs text-zinc-500 font-bold uppercase">Repetir Anterior</span>
                        <h4 className="text-white font-bold">{recentWorkouts[0].name}</h4>
                    </div>
                </div>
                <ChevronRight className="text-zinc-600" />
            </button>
        )}
      </div>

      {/* Habit Tracker */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Hábitos Diários</h3>
        <div className="grid grid-cols-2 gap-4">
            {/* Water */}
            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-2 text-blue-400 mb-2">
                    <Droplets size={18} />
                    <span className="text-xs font-bold uppercase">Hidratação</span>
                </div>
                <div className="flex items-end space-x-1">
                    <span className="text-2xl font-bold text-white">{habits.waterIntake}</span>
                    <span className="text-xs text-zinc-500 mb-1">/ 2500ml</span>
                </div>
                <button 
                    onClick={() => updateHabit('waterIntake', habits.waterIntake + 250)}
                    className="mt-3 w-full py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500/20"
                >
                    +250ml
                </button>
            </div>

            {/* Sleep */}
            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center space-x-2 text-purple-400 mb-2">
                    <Moon size={18} />
                    <span className="text-xs font-bold uppercase">Sono</span>
                </div>
                <div className="flex items-end space-x-1">
                    <span className="text-2xl font-bold text-white">{habits.sleepHours}</span>
                    <span className="text-xs text-zinc-500 mb-1">hrs</span>
                </div>
                <div className="flex mt-3 space-x-2">
                     <button onClick={() => updateHabit('sleepHours', Math.max(0, habits.sleepHours - 0.5))} className="flex-1 py-2 bg-zinc-800 rounded-lg text-zinc-400">-</button>
                     <button onClick={() => updateHabit('sleepHours', habits.sleepHours + 0.5)} className="flex-1 py-2 bg-zinc-800 rounded-lg text-white">+</button>
                </div>
            </div>
        </div>
      </div>

      {/* Recent History */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">Histórico Recente</h3>
            <span className="text-xs text-ains-primary cursor-pointer" onClick={() => navigate('/stats')}>Ver Tudo</span>
        </div>
        <div className="space-y-3">
            {recentWorkouts.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                    Nenhum treino ainda. Comece hoje!
                </div>
            ) : (
                recentWorkouts.map((workout) => (
                    <div key={workout.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-zinc-800 p-3 rounded-lg text-ains-primary">
                                <Flame size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{workout.name}</h4>
                                <p className="text-xs text-zinc-500">{new Date(workout.dateCreated).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-white font-bold">{workout.exercises.length} Ex</p>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
