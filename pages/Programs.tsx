
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Calendar, Zap, Shield, Crown } from 'lucide-react';
import { PROGRAMS } from '../constants';

export const Programs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ains-bg pb-24 font-sans">
        <div className="p-6 pt-8 flex items-center gap-4 sticky top-0 bg-ains-bg/90 backdrop-blur z-20 border-b border-white/5">
            <button onClick={() => navigate('/')}><ArrowLeft className="text-zinc-400"/></button>
            <h1 className="text-2xl font-display font-bold uppercase text-white italic">Protocolos</h1>
        </div>

        <div className="p-6 space-y-8">
            {PROGRAMS.map((prog, idx) => (
                <div key={prog.id} className="relative group cursor-pointer" onClick={() => navigate('/campaign')}>
                    {/* Image Card */}
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative shadow-2xl border border-white/10">
                        <img src={prog.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        
                        <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-black px-2 py-1 uppercase rounded">
                            {prog.durationWeeks} Semanas
                        </div>

                        <div className="absolute bottom-6 left-6 right-6">
                            <h2 className="text-3xl font-display font-bold uppercase italic text-white leading-none mb-2">{prog.title}</h2>
                            <p className="text-sm text-zinc-300 line-clamp-2">{prog.description}</p>
                            
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1 text-xs font-bold text-ains-primary uppercase">
                                    <Zap size={14}/> {prog.level}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Coming Soon Teaser */}
            <div className="border border-dashed border-zinc-800 rounded-2xl p-8 text-center opacity-50">
                <Crown size={32} className="mx-auto text-zinc-500 mb-2"/>
                <h3 className="font-bold text-white uppercase">Em breve</h3>
                <p className="text-xs text-zinc-500">Protocolo de Mobilidade & Parada de Mão</p>
            </div>
        </div>
    </div>
  );
};
