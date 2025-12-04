
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISE_DATABASE } from '../constants';
import { ExerciseCategory, Exercise } from '../types';
import { Search, Play, X, Flame, Plus, BicepsFlexed, Activity, CheckCircle2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { YouTubeEmbed } from '../components/YouTubeEmbed';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ExerciseCategory | 'Todos'>('Todos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Exercise | null>(null);

  // Otimização: Filtrar apenas quando as dependências mudarem
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    
    return EXERCISE_DATABASE.filter(ex => {
        const matchesSearch = 
            term === '' ||
            ex.name.toLowerCase().includes(term) || 
            ex.muscleGroup.toLowerCase().includes(term);
            
        const matchesFilter = filter === 'Todos' || ex.category === filter;
        
        return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  return (
    <div className="p-6 min-h-screen bg-black pb-24 font-sans">
      <h1 className="text-3xl font-display font-bold text-white uppercase mb-6 italic">Biblioteca</h1>
      
      <div className="relative mb-6">
          <input 
            className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 text-white placeholder-zinc-600 focus:border-ains-primary outline-none uppercase font-bold tracking-wide rounded-xl"
            placeholder="BUSCAR MOVIMENTO..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-zinc-600" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
          {['Todos', ...Object.values(ExerciseCategory)].map(cat => (
              <button 
                key={cat} onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 font-bold uppercase text-[10px] whitespace-nowrap border rounded-full transition-all ${filter === cat ? 'bg-white text-black border-white' : 'bg-transparent border-zinc-800 text-zinc-500'}`}
              >
                  {cat.split('/')[0]} 
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
          {filtered.length > 0 ? (
              filtered.map(ex => (
                  <div key={ex.id} onClick={() => setSelected(ex)} className="bg-zinc-900 border border-zinc-800 active:scale-95 transition-transform cursor-pointer group flex rounded-xl overflow-hidden h-24">
                      <div className="w-24 bg-zinc-950 relative">
                          <img src={ex.videoPlaceholder} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale"/>
                          <div className="absolute inset-0 flex items-center justify-center"><Play size={20} className="text-white drop-shadow-md fill-white"/></div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-center">
                          <h3 className="font-display font-bold text-white uppercase leading-none mb-1 text-sm">{ex.name}</h3>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{ex.muscleGroup}</p>
                          <div className="flex gap-2">
                              <span className="text-[9px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase">{ex.category.split(' ')[0]}</span>
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <div className="text-center text-zinc-500 py-10 font-mono text-sm uppercase">Nenhum exercício encontrado.</div>
          )}
      </div>

       <button 
        onClick={() => navigate('/builder')}
        className="fixed bottom-24 right-6 bg-ains-primary text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] z-40 hover:scale-105 transition-transform flex items-center font-bold"
      >
          <Plus size={24} className="mr-2" />
      </button>

      {/* DETAILED EXERCISE VIEW */}
      {selected && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
              {/* Video Header */}
              <div className="relative h-[40vh] w-full bg-zinc-900">
                  <YouTubeEmbed url={selected.videoUrl} title={selected.name} placeholder={selected.videoPlaceholder} autoPlayOnLoad />
                  <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-black/50 p-2 text-white rounded-full backdrop-blur-md z-50"><X /></button>
              </div>

              {/* Content Scroller */}
              <div className="flex-1 overflow-y-auto p-6 bg-black text-white">
                   <div className="mb-6">
                        <span className="text-ains-primary text-xs font-black uppercase tracking-widest">{selected.category}</span>
                        <h1 className="text-3xl font-display font-bold uppercase italic leading-none mt-1">{selected.name}</h1>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-zinc-900 p-3 rounded-lg text-center border border-zinc-800">
                            <Flame size={18} className="text-orange-500 mx-auto mb-1"/>
                            <span className="text-xs font-bold text-zinc-400">{selected.caloriesPerMinute || 5} cal/min</span>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded-lg text-center border border-zinc-800">
                            <BicepsFlexed size={18} className="text-blue-500 mx-auto mb-1"/>
                            <span className="text-xs font-bold text-zinc-400">{selected.muscleGroup}</span>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded-lg text-center border border-zinc-800">
                            <Activity size={18} className="text-green-500 mx-auto mb-1"/>
                            <span className="text-xs font-bold text-zinc-400">{selected.difficulty}</span>
                        </div>
                   </div>

                   {/* Steps */}
                   <div className="mb-8">
                       <h3 className="font-bold uppercase text-sm text-zinc-500 mb-3 border-b border-zinc-800 pb-1">Passo a Passo</h3>
                       <ul className="space-y-4">
                           {selected.stepByStep?.map((step, idx) => (
                               <li key={idx} className="flex gap-4">
                                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 text-ains-primary font-bold flex items-center justify-center text-xs border border-zinc-700">{idx + 1}</div>
                                   <p className="text-sm text-zinc-300 leading-relaxed">{step}</p>
                               </li>
                           ))}
                       </ul>
                   </div>

                    {/* VARIATIONS SECTION */}
                   {(selected.variations?.easier || selected.variations?.harder) && (
                        <div className="mb-8 animate-fade-in">
                            <h3 className="font-bold uppercase text-sm text-zinc-500 mb-3 border-b border-zinc-800 pb-1">Variações & Progressões</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Easier Column */}
                                {selected.variations?.easier && (
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                        <div className="flex items-center gap-2 mb-3 text-green-400 font-bold uppercase text-[10px] tracking-wider">
                                            <ArrowDownRight size={14} /> Mais Leve
                                        </div>
                                        <ul className="space-y-2">
                                            {selected.variations.easier.map(v => (
                                                <li key={v} className="text-xs text-zinc-300 font-medium bg-zinc-900 px-2 py-1.5 rounded border border-zinc-800">{v}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Harder Column */}
                                {selected.variations?.harder && (
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                        <div className="flex items-center gap-2 mb-3 text-red-400 font-bold uppercase text-[10px] tracking-wider">
                                            <ArrowUpRight size={14} /> Mais Pesado
                                        </div>
                                        <ul className="space-y-2">
                                            {selected.variations.harder.map(v => (
                                                <li key={v} className="text-xs text-zinc-300 font-medium bg-zinc-900 px-2 py-1.5 rounded border border-zinc-800">{v}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                   )}

                   {/* Muscles */}
                   <div className="mb-8">
                       <h3 className="font-bold uppercase text-sm text-zinc-500 mb-3 border-b border-zinc-800 pb-1">Ativação Muscular</h3>
                       <div className="flex flex-wrap gap-2">
                           {selected.musculosPrimarios.map(m => (
                               <span key={m} className="bg-ains-primary/10 text-ains-primary border border-ains-primary/30 px-3 py-1 rounded text-xs font-bold uppercase">{m}</span>
                           ))}
                       </div>
                   </div>

                   {/* Tips */}
                   <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                       <h3 className="text-white font-bold uppercase text-xs mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Dicas de Mestre</h3>
                       <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-400">
                           {selected.commonErrors?.map((err, i) => (
                               <li key={i}>Evite: {err}</li>
                           ))}
                           <li className="text-ains-primary mt-2 italic">{selected.breathingTip}</li>
                       </ul>
                   </div>

                   <div className="h-10"></div>
              </div>
          </div>
      )}
    </div>
  );
};
