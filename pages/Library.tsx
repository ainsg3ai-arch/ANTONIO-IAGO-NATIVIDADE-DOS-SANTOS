
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISE_DATABASE } from '../constants';
import { MuscleGroup, Exercise } from '../types';
import { Search, Play, X, Flame, Plus, BicepsFlexed, Activity } from 'lucide-react';
import { YouTubeEmbed } from '../components/YouTubeEmbed';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<MuscleGroup | 'Todos'>('Todos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Exercise | null>(null);

  const filtered = EXERCISE_DATABASE.filter(ex => {
    const term = search.toLowerCase();
    const matchesSearch = 
        ex.name.toLowerCase().includes(term) || 
        ex.musculosPrimarios?.some(m => m.toLowerCase().includes(term)) ||
        ex.musculosSecundarios?.some(m => m.toLowerCase().includes(term));
        
    const matchesFilter = filter === 'Todos' || ex.muscleGroup === filter;
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 min-h-screen bg-ains-black pb-24">
      <h1 className="text-3xl font-display font-bold text-white uppercase mb-6">Arsenal</h1>
      
      <div className="relative mb-6">
          <input 
            className="w-full bg-zinc-900 border border-zinc-700 p-4 pl-12 text-white placeholder-zinc-600 focus:border-ains-primary outline-none uppercase font-bold tracking-wide rounded-sm"
            placeholder="BUSCAR EXERCÍCIO OU MÚSCULO..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-zinc-600" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
          {['Todos', ...Object.values(MuscleGroup)].map(cat => (
              <button 
                key={cat} onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 font-bold uppercase text-xs whitespace-nowrap border rounded-sm ${filter === cat ? 'bg-ains-primary border-ains-primary text-black' : 'bg-transparent border-zinc-800 text-zinc-500'}`}
              >
                  {cat}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ex => (
              <div key={ex.id} onClick={() => setSelected(ex)} className="bg-zinc-900 border border-zinc-800 hover:border-ains-primary/50 transition-colors cursor-pointer group flex rounded-sm overflow-hidden">
                  <div className="w-24 bg-black relative">
                      <img src={ex.videoPlaceholder} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"/>
                      <div className="absolute inset-0 flex items-center justify-center"><Play size={20} className="text-white drop-shadow-md"/></div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                      <h3 className="font-display font-bold text-white uppercase leading-none mb-2 text-sm">{ex.name}</h3>
                      <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-1 uppercase">{ex.muscleGroup}</span>
                          {ex.musculosPrimarios && ex.musculosPrimarios.length > 0 && (
                              <span className="text-[10px] font-bold bg-ains-primary/20 text-ains-primary px-2 py-1 uppercase">{ex.musculosPrimarios[0]}</span>
                          )}
                      </div>
                  </div>
              </div>
          ))}
      </div>

       <button 
        onClick={() => navigate('/builder')}
        className="fixed bottom-24 right-6 bg-ains-primary text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] z-40 hover:scale-105 transition-transform flex items-center font-bold"
      >
          <Plus size={24} className="mr-2" />
      </button>

      {selected && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
                  <div className="relative aspect-video">
                      <YouTubeEmbed url={selected.videoUrl} title={selected.name} placeholder={selected.videoPlaceholder} autoPlayOnLoad />
                      <button onClick={() => setSelected(null)} className="absolute top-2 right-2 bg-black/50 p-2 text-white hover:text-red-500 transition-colors rounded-full"><X /></button>
                  </div>
                  <div className="p-6">
                      <h2 className="text-2xl font-display font-bold uppercase text-white mb-4">{selected.name}</h2>
                      
                      <div className="flex flex-wrap gap-4 mb-6 text-sm font-mono text-zinc-400">
                          <div className="flex items-center"><Flame size={16} className="text-orange-500 mr-2"/> {selected.caloriesPerMinute} KCAL/MIN</div>
                          <div className="uppercase px-2 py-1 bg-zinc-800 rounded-sm font-bold">{selected.muscleGroup}</div>
                      </div>

                      {/* Muscle Details Section */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          {selected.musculosPrimarios && selected.musculosPrimarios.length > 0 && (
                              <div className="bg-black/30 p-3 rounded-sm border border-zinc-800">
                                  <div className="flex items-center gap-2 text-ains-primary text-xs font-bold uppercase mb-2">
                                      <BicepsFlexed size={14}/> Primários
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                      {selected.musculosPrimarios.map(m => (
                                          <span key={m} className="text-xs text-white bg-zinc-800 px-2 py-1 rounded-sm border border-zinc-700">{m}</span>
                                      ))}
                                  </div>
                              </div>
                          )}
                          
                          {selected.musculosSecundarios && selected.musculosSecundarios.length > 0 && (
                              <div className="bg-black/30 p-3 rounded-sm border border-zinc-800">
                                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase mb-2">
                                      <Activity size={14}/> Secundários
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                      {selected.musculosSecundarios.map(m => (
                                          <span key={m} className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-sm">{m}</span>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>

                      <p className="text-zinc-300 leading-relaxed mb-6 text-sm">{selected.description}</p>
                      <button onClick={() => setSelected(null)} className="w-full bg-zinc-800 text-white font-bold py-4 uppercase hover:bg-zinc-700 rounded-sm transition-colors">Fechar</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
