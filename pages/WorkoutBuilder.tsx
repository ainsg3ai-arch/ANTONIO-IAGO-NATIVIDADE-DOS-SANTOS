
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISE_DATABASE } from '../constants';
import { Exercise, MuscleGroup } from '../types';
import { generateUUID } from '../services/aiLogic';
import { saveTemplate } from '../services/storageService';
import { Button } from '../components/Button';
import { Search, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

export const WorkoutBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MuscleGroup | 'Todos'>('Todos');

  // Filter available exercises
  const filteredDatabase = EXERCISE_DATABASE.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'Todos' || ex.muscleGroup === filter;
      return matchesSearch && matchesFilter;
  });

  const addExercise = (ex: Exercise) => {
      // Add unique instance
      setSelectedExercises([...selectedExercises, { ...ex }]);
  };

  const removeExercise = (index: number) => {
      const newList = [...selectedExercises];
      newList.splice(index, 1);
      setSelectedExercises(newList);
  };

  const handleSave = () => {
      if (!name) {
          alert("Dê um nome ao seu treino!");
          return;
      }
      if (selectedExercises.length === 0) {
          alert("Adicione pelo menos um exercício.");
          return;
      }

      saveTemplate({
          id: generateUUID(),
          name,
          exercises: selectedExercises,
          createdAt: Date.now()
      });
      navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-ains-black">
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <button onClick={() => navigate('/library')} className="p-2 -ml-2 text-zinc-400">
                <ArrowLeft />
            </button>
            <h1 className="text-lg font-bold text-white">Criar Rotina</h1>
            <button onClick={handleSave} className="text-ains-primary font-bold text-sm">SALVAR</button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Available Exercises */}
            <div className="flex-1 flex flex-col border-r border-zinc-800">
                <div className="p-4 space-y-4 bg-zinc-900/50">
                    <input 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-ains-primary"
                        placeholder="Nome do Treino (ex: Super Peitoral)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className="relative">
                         <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
                         <input 
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 pl-10 text-white text-sm focus:outline-none"
                            placeholder="Buscar exercícios..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                         />
                    </div>
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        {['Todos', ...Object.values(MuscleGroup)].map(g => (
                            <button 
                                key={g}
                                onClick={() => setFilter(g as any)}
                                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${filter === g ? 'bg-ains-primary text-black' : 'bg-zinc-800 text-zinc-400'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredDatabase.map(ex => (
                        <button 
                            key={ex.id} 
                            onClick={() => addExercise(ex)}
                            className="w-full flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:border-zinc-600"
                        >
                            <div className="text-left">
                                <h4 className="text-white font-bold text-sm">{ex.name}</h4>
                                <span className="text-[10px] text-zinc-500 uppercase">{ex.muscleGroup}</span>
                            </div>
                            <Plus size={20} className="text-ains-primary" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right/Bottom: Selected List */}
            <div className="h-1/3 md:h-full md:w-1/3 bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col">
                <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400 uppercase">Selecionados ({selectedExercises.length})</span>
                    <span className="text-xs text-zinc-600">Arraste para organizar (Em breve)</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {selectedExercises.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-zinc-600 text-center text-sm p-4">
                            Selecione exercícios da lista para montar seu treino.
                        </div>
                    ) : (
                        selectedExercises.map((ex, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg animate-fade-in">
                                <span className="text-white text-sm font-medium truncate w-3/4">{idx + 1}. {ex.name}</span>
                                <button onClick={() => removeExercise(idx)} className="text-red-500 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
