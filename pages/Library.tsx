
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISE_DATABASE } from '../constants';
import { ExerciseCategory, Exercise, ExperienceLevel } from '../types';
import { getExerciseLogs } from '../services/storageService';
import { Search, Play, X, Flame, Plus, Dumbbell, CheckCircle2, ArrowDownRight, ArrowUpRight, TrendingUp, Info } from 'lucide-react';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { MiniChart } from '../components/MiniChart';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ExerciseCategory | 'Todos'>('Todos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
      if(selected) {
          const allLogs = getExerciseLogs();
          const exLogs = allLogs.filter(l => l.exerciseId === selected.id);
          const chartData = exLogs.map(l => ({ date: l.date, value: l.reps }));
          setLogs(chartData);
      }
  }, [selected]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return EXERCISE_DATABASE.filter(ex => {
        const matchesSearch = term === '' || ex.name.toLowerCase().includes(term) || ex.muscleGroup.toLowerCase().includes(term);
        const matchesFilter = filter === 'Todos' || ex.category === filter;
        return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  return (
    <div className="p-6 min-h-screen bg-ains-bg pb-24 font-sans">
      <div className="pt-6 mb-8">
          <p className="text-ains-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Enciclopédia</p>
          <h1 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter">Biblioteca</h1>
      </div>
      
      <div className="relative mb-8 group">
          <input 
            className="w-full bg-zinc-900 border border-zinc-800 p-5 pl-14 text-white placeholder-zinc-700 focus:border-ains-primary transition-all outline-none uppercase font-black tracking-widest rounded-2xl shadow-xl"
            placeholder="BUSCAR MOVIMENTO..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-5 top-5 text-zinc-700 group-focus-within:text-ains-primary transition-colors" size={20} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {['Todos', ...Object.values(ExerciseCategory)].map(cat => (
              <button 
                key={cat} onClick={() => setFilter(cat as any)}
                className={`px-6 py-2.5 font-black uppercase text-[10px] whitespace-nowrap border-2 rounded-full transition-all tracking-widest ${filter === cat ? 'bg-white text-black border-white' : 'bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
              >
                  {cat.split(' ')[0]} 
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
          {filtered.length > 0 ? (
              filtered.map(ex => (
                  <div 
                    key={ex.id} 
                    onClick={() => setSelected(ex)} 
                    className="bg-zinc-900/50 border border-zinc-800/80 active:scale-95 transition-all cursor-pointer group flex rounded-3xl overflow-hidden h-28 relative shadow-lg"
                  >
                      <div className="w-28 bg-zinc-950 relative shrink-0">
                          <img src={ex.videoPlaceholder} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt={ex.name}/>
                          <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full border border-white/10">
                                <Play size={18} className="text-white fill-white"/>
                              </div>
                          </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start">
                              <h3 className="font-display font-bold text-white uppercase italic leading-none mb-1 text-base tracking-tight">{ex.name}</h3>
                              <div className="flex gap-0.5">
                                  {Array.from({length: 5}).map((_, i) => (
                                      <div key={i} className={`w-1 h-3 rounded-full ${i < ex.difficultyScore ? 'bg-ains-primary' : 'bg-zinc-800'}`}></div>
                                  ))}
                              </div>
                          </div>
                          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-3">{ex.muscleGroup}</p>
                          <div className="flex gap-2">
                              <span className="text-[8px] font-black bg-zinc-800 text-zinc-500 px-2 py-1 rounded-md uppercase tracking-widest">{ex.category.split(' ')[0]}</span>
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <div className="text-center text-zinc-700 py-16 font-mono text-xs uppercase tracking-[0.2em] border border-dashed border-zinc-800 rounded-3xl">Nenhum registro encontrado.</div>
          )}
      </div>

      {/* MODAL DETALHADO (ESTILO PREMIUM) */}
      {selected && (
          <div className="fixed inset-0 z-[100] bg-ains-bg flex flex-col animate-fade-in">
              <div className="relative h-[42vh] w-full bg-black overflow-hidden">
                  <YouTubeEmbed url={selected.videoUrl} title={selected.name} placeholder={selected.videoPlaceholder} autoPlayOnLoad />
                  <button 
                    onClick={() => setSelected(null)} 
                    className="absolute top-6 right-6 bg-black/60 backdrop-blur-md p-3 text-white rounded-full border border-white/10 z-50 hover:bg-black/80 transition-all"
                  >
                    <X size={24} />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
                      <div className="flex items-center gap-2 mb-2">
                          <span className="bg-ains-primary text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Nível {selected.difficultyScore}</span>
                      </div>
                      <h1 className="text-4xl font-display font-bold uppercase italic leading-none text-white drop-shadow-xl">{selected.name}</h1>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ains-bg via-transparent to-transparent"></div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                   {/* CHART & STATS */}
                   <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6 shadow-inner">
                       <div className="flex items-center justify-between mb-6">
                           <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                               <TrendingUp size={14} className="text-ains-primary"/> Histórico de Força
                           </h3>
                           {logs.length > 0 && <span className="text-[10px] font-bold text-ains-primary">+{Math.round((logs[logs.length-1].value / (logs[0].value || 1) - 1) * 100)}%</span>}
                       </div>
                       <div className="h-32 w-full mb-6"><MiniChart data={logs} /></div>
                       <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
                           <div className="text-center">
                               <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Recorde Pessoal</p>
                               <p className="text-3xl font-display font-bold text-white italic">{logs.length > 0 ? Math.max(...logs.map(l => l.value)) : '--'}</p>
                           </div>
                           <div className="text-center">
                               <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Última Série</p>
                               <p className="text-3xl font-display font-bold text-white italic">{logs.length > 0 ? logs[logs.length-1].value : '--'}</p>
                           </div>
                       </div>
                   </div>

                   {/* DESCRIÇÃO TÉCNICA */}
                   <div>
                       <h3 className="text-xs font-black uppercase text-zinc-500 mb-4 tracking-widest flex items-center gap-2"><Info size={14}/> Detalhes Técnicos</h3>
                       <p className="text-zinc-400 text-sm leading-relaxed mb-6">{selected.description}</p>
                       <ul className="space-y-4">
                           {selected.stepByStep?.map((step, idx) => (
                               <li key={idx} className="flex gap-5">
                                   <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-zinc-900 text-ains-primary font-display font-bold flex items-center justify-center text-sm border border-zinc-800 shadow-lg">{idx + 1}</div>
                                   <p className="text-sm text-zinc-300 leading-relaxed pt-1.5">{step}</p>
                               </li>
                           ))}
                       </ul>
                   </div>

                   {/* PROGRESSÕES & REGRESSÕES */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selected.regressions && selected.regressions.length > 0 && (
                            <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800">
                                <div className="flex items-center gap-2 mb-4 text-green-500 font-black uppercase text-[10px] tracking-[0.2em]">
                                    <ArrowDownRight size={16} /> Regressão (Mais Fácil)
                                </div>
                                <div className="space-y-2">
                                    {selected.regressions.map(v => (
                                        <div key={v} className="text-xs text-zinc-400 font-bold bg-black/40 px-4 py-3 rounded-2xl border border-white/5">{v}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {selected.progressions && selected.progressions.length > 0 && (
                            <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800">
                                <div className="flex items-center gap-2 mb-4 text-red-500 font-black uppercase text-[10px] tracking-[0.2em]">
                                    <ArrowUpRight size={16} /> Progressão (Próximo Nível)
                                </div>
                                <div className="space-y-2">
                                    {selected.progressions.map(v => (
                                        <div key={v} className="text-xs text-zinc-400 font-bold bg-black/40 px-4 py-3 rounded-2xl border border-white/5">{v}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                   </div>

                   {/* ERROS COMUNS & RESPIRAÇÃO */}
                   <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
                       <h3 className="text-white font-display font-bold uppercase italic text-lg mb-4 flex items-center gap-2"><CheckCircle2 size={20} className="text-green-500"/> Checkpoints de Forma</h3>
                       <div className="space-y-4">
                           {selected.commonErrors?.map((err, i) => (
                               <div key={i} className="flex gap-3 items-start">
                                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                                   <p className="text-xs text-zinc-400"><span className="text-zinc-200 font-bold">Evite:</span> {err}</p>
                               </div>
                           ))}
                           <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-ains-primary/10 flex items-center justify-center">
                                   <TrendingUp size={16} className="text-ains-primary" />
                               </div>
                               <p className="text-xs text-ains-primary italic font-medium">{selected.breathingTip}</p>
                           </div>
                       </div>
                   </div>

                   <div className="h-10"></div>
              </div>
          </div>
      )}
    </div>
  );
};
