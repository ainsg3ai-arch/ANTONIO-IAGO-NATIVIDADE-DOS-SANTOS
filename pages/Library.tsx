
import React, { useState } from 'react';
import { EXERCISE_DATABASE } from '../constants';
import { MuscleGroup, Exercise } from '../types';
import { Search, Youtube, Play, X, Flame, Target } from 'lucide-react';
import { YouTubeEmbed } from '../components/YouTubeEmbed';

export const Library: React.FC = () => {
  const [filter, setFilter] = useState<MuscleGroup | 'Todos'>('Todos');
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = EXERCISE_DATABASE.filter(ex => {
    const matchesGroup = filter === 'Todos' || ex.muscleGroup === filter;
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="p-6 min-h-screen pb-24">
      <h1 className="text-3xl font-bold text-white mb-6">Biblioteca</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
        <input 
            type="text" 
            placeholder="Buscar exercícios..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 text-white focus:outline-none focus:border-ains-primary placeholder:text-zinc-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 no-scrollbar">
        {['Todos', ...Object.values(MuscleGroup)].map((cat) => (
            <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === cat ? 'bg-ains-primary text-ains-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
                {cat}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ex) => (
            <button 
                key={ex.id} 
                onClick={() => setSelectedExercise(ex)}
                className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex group text-left hover:border-zinc-600 transition-colors"
            >
                <div className="w-28 h-24 bg-zinc-800 flex-shrink-0 relative">
                    <img src={ex.videoPlaceholder} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={ex.name} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                        </div>
                    </div>
                </div>
                <div className="p-3 flex flex-col justify-center flex-1">
                    <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2">{ex.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] uppercase bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">{ex.muscleGroup}</span>
                    </div>
                    <span className="mt-2 text-xs text-ains-primary font-bold flex items-center space-x-1 group-hover:underline">Ficha Técnica</span>
                </div>
            </button>
        ))}
      </div>

      {/* Detail Modal / Tech Sheet */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 flex justify-between items-center border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white truncate pr-4">Ficha Técnica</h3>
                    <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="w-full aspect-video bg-black">
                    <YouTubeEmbed 
                        url={selectedExercise.videoUrl} 
                        title={selectedExercise.name} 
                        placeholder={selectedExercise.videoPlaceholder}
                        autoPlayOnLoad={true}
                    />
                </div>

                <div className="p-6 overflow-y-auto">
                    <h2 className="text-xl font-bold text-white mb-4">{selectedExercise.name}</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center text-zinc-400 text-xs font-bold uppercase mb-1">
                                <Flame size={14} className="mr-1 text-orange-500" /> Queima Estimada
                            </div>
                            <span className="text-white font-bold">{selectedExercise.caloriesPerMinute || 5} kcal/min</span>
                        </div>
                        <div className="bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center text-zinc-400 text-xs font-bold uppercase mb-1">
                                <Target size={14} className="mr-1 text-red-500" /> Dificuldade
                            </div>
                            <span className="text-white font-bold">{selectedExercise.difficulty}</span>
                        </div>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-300 uppercase mb-2">Anatomia</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 rounded-full bg-ains-primary text-black text-xs font-bold">
                           Primário: {selectedExercise.muscleGroup}
                        </span>
                        {selectedExercise.secondaryMuscles?.map(m => (
                            <span key={m} className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold border border-zinc-700">
                                {m}
                            </span>
                        ))}
                    </div>
                    
                    <h4 className="text-sm font-bold text-zinc-300 uppercase mb-2">Instruções de Execução</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">{selectedExercise.description}</p>
                    
                    <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-4">
                        Requer: {selectedExercise.equipmentRequired.join(', ')}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
