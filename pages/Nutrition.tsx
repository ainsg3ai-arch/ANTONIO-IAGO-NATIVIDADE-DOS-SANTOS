
import React, { useState, useEffect } from 'react';
import { getProfile, getDailyNutrition, addMealItem, removeMealItem } from '../services/storageService';
import { UserProfile, Goal, MealItem } from '../types';
import { Calculator, ArrowLeft, Plus, Trash2, Flame, Droplet, Wheat, Egg } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateUUID } from '../services/aiLogic';

const COMMON_FOODS: Omit<MealItem, 'id'>[] = [
    { name: 'Ovo Cozido (1 unid)', calories: 70, protein: 6, carbs: 0.5, fat: 5, icon: '🥚' },
    { name: 'Frango Grelhado (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, icon: '🍗' },
    { name: 'Arroz Branco (100g)', calories: 130, protein: 2, carbs: 28, fat: 0.2, icon: '🍚' },
    { name: 'Banana Prata', calories: 90, protein: 1, carbs: 23, fat: 0.3, icon: '🍌' },
    { name: 'Whey Protein (30g)', calories: 120, protein: 24, carbs: 3, fat: 1, icon: '🥤' },
    { name: 'Aveia (50g)', calories: 180, protein: 7, carbs: 30, fat: 3, icon: '🌾' },
    { name: 'Pasta de Amendoim (15g)', calories: 90, protein: 4, carbs: 3, fat: 8, icon: '🥜' },
];

export const Nutrition: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayLog, setTodayLog] = useState<MealItem[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [customCals, setCustomCals] = useState('');

  // Daily Targets
  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(150);
  const [targetCarbs, setTargetCarbs] = useState(200);
  const [targetFat, setTargetFat] = useState(60);

  useEffect(() => {
    const p = getProfile();
    if (p) {
        setProfile(p);
        calculateTargets(p);
    }
    refreshLog();
  }, []);

  const refreshLog = () => {
      const date = new Date().toISOString().split('T')[0];
      const log = getDailyNutrition(date);
      setTodayLog(log.items);
  }

  const calculateTargets = (p: UserProfile) => {
      // Harris-Benedict Equation (Simplified)
      let bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age;
      bmr += p.gender === 'male' ? 5 : -161;
      
      // Activity Multiplier (Assuming moderate activity based on usage of app)
      const tdee = bmr * 1.55; 

      let goalCals = tdee;
      if (p.goal === Goal.LOSE_WEIGHT) goalCals -= 500;
      if (p.goal === Goal.BUILD_MUSCLE) goalCals += 300;

      setTargetCalories(Math.round(goalCals));
      
      // Macros Split (Protein 2g/kg roughly)
      const protein = p.weight * 2;
      const fat = (goalCals * 0.25) / 9; // 25% fat
      const carbs = (goalCals - (protein * 4) - (fat * 9)) / 4;

      setTargetProtein(Math.round(protein));
      setTargetFat(Math.round(fat));
      setTargetCarbs(Math.round(carbs));
  };

  const handleAddCommon = (food: Omit<MealItem, 'id'>) => {
      addMealItem({ ...food, id: generateUUID() });
      setShowAddMenu(false);
      refreshLog();
  };

  const handleAddCustom = () => {
      const cals = parseInt(customCals);
      if (cals > 0) {
          addMealItem({
              id: generateUUID(),
              name: 'Registro Rápido',
              calories: cals,
              protein: 0,
              carbs: 0,
              fat: 0,
              icon: '⚡'
          });
          setCustomCals('');
          setShowAddMenu(false);
          refreshLog();
      }
  };

  const handleDelete = (id: string) => {
      const date = new Date().toISOString().split('T')[0];
      removeMealItem(id, date);
      refreshLog();
  };

  const currentStats = todayLog.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  if (!profile) return null;

  return (
    <div className="p-6 min-h-screen bg-ains-black pb-32 text-white font-sans relative">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')}><ArrowLeft className="text-zinc-400"/></button>
            <h1 className="text-3xl font-display font-bold uppercase">Nutrição</h1>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl mb-8 relative overflow-hidden">
             {/* Progress Circle Background */}
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-ains-primary/10 rounded-full blur-3xl"></div>
             
             <div className="flex justify-between items-start mb-6">
                 <div>
                     <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Calorias Restantes</div>
                     <div className="text-4xl font-display font-bold text-white">
                         {Math.max(0, targetCalories - currentStats.calories)}
                     </div>
                     <div className="text-xs text-zinc-400 mt-1">Meta: {targetCalories} kcal</div>
                 </div>
                 <div className="text-right">
                     <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Consumido</div>
                     <div className="text-xl font-mono text-ains-primary">{currentStats.calories}</div>
                 </div>
             </div>

             {/* Macros Bars */}
             <div className="space-y-3">
                 <div>
                     <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                         <span className="text-blue-400 flex items-center gap-1"><Egg size={10}/> Proteína</span>
                         <span className="text-zinc-500">{Math.round(currentStats.protein)} / {targetProtein}g</span>
                     </div>
                     <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 rounded-full" style={{width: `${Math.min(100, (currentStats.protein / targetProtein) * 100)}%`}}></div>
                     </div>
                 </div>
                 <div>
                     <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                         <span className="text-green-400 flex items-center gap-1"><Wheat size={10}/> Carbo</span>
                         <span className="text-zinc-500">{Math.round(currentStats.carbs)} / {targetCarbs}g</span>
                     </div>
                     <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 rounded-full" style={{width: `${Math.min(100, (currentStats.carbs / targetCarbs) * 100)}%`}}></div>
                     </div>
                 </div>
                 <div>
                     <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                         <span className="text-yellow-400 flex items-center gap-1"><Droplet size={10}/> Gordura</span>
                         <span className="text-zinc-500">{Math.round(currentStats.fat)} / {targetFat}g</span>
                     </div>
                     <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                         <div className="h-full bg-yellow-500 rounded-full" style={{width: `${Math.min(100, (currentStats.fat / targetFat) * 100)}%`}}></div>
                     </div>
                 </div>
             </div>
        </div>

        {/* LOG LIST */}
        <div className="mb-20">
            <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4 tracking-wider">Refeições de Hoje</h3>
            {todayLog.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-sm">
                    Nenhuma refeição registrada.
                </div>
            ) : (
                <div className="space-y-2">
                    {todayLog.map(item => (
                        <div key={item.id} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex justify-between items-center animate-fade-in">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <div className="text-sm font-bold text-white">{item.name}</div>
                                    <div className="text-[10px] text-zinc-500 font-mono">
                                        {item.calories}kcal • P:{item.protein} C:{item.carbs} G:{item.fat}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* ADD BUTTON */}
        <button 
            onClick={() => setShowAddMenu(true)}
            className="fixed bottom-24 right-6 bg-ains-primary text-black p-4 rounded-full shadow-neon z-40 hover:scale-105 transition-transform"
        >
            <Plus size={24} strokeWidth={3} />
        </button>

        {/* ADD MENU MODAL */}
        {showAddMenu && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
                <div className="bg-zinc-900 rounded-t-3xl border-t border-zinc-700 p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-display font-bold uppercase">Adicionar Alimento</h2>
                        <button onClick={() => setShowAddMenu(false)} className="text-zinc-500">Fechar</button>
                    </div>

                    <div className="mb-6">
                        <div className="text-xs font-bold uppercase text-zinc-500 mb-2">Registro Rápido (Calorias)</div>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                value={customCals}
                                onChange={e => setCustomCals(e.target.value)}
                                placeholder="Ex: 300"
                                className="flex-1 bg-black border border-zinc-700 p-3 rounded-xl text-white outline-none focus:border-ains-primary"
                            />
                            <button onClick={handleAddCustom} className="bg-zinc-800 px-4 rounded-xl font-bold uppercase text-xs hover:bg-zinc-700">Add</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {COMMON_FOODS.map((food, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => handleAddCommon(food)}
                                className="bg-black p-3 rounded-xl border border-zinc-800 flex flex-col items-center text-center hover:border-ains-primary transition-colors"
                            >
                                <span className="text-2xl mb-2">{food.icon}</span>
                                <span className="text-sm font-bold text-white">{food.name}</span>
                                <span className="text-[10px] text-zinc-500">{food.calories} kcal</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
