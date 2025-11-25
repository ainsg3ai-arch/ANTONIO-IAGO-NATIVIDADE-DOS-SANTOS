
import React, { useState } from 'react';
import { ArrowLeft, Calculator, Activity, Dumbbell, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Tools: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'1rm' | 'bmi'>('1rm');

  // 1RM State
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState<number | null>(null);

  // BMI State
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState(''); // cm
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  const calculate1RM = () => {
      const w = parseFloat(weight);
      const r = parseFloat(reps);
      if(w && r) {
          // Epley Formula
          const max = w * (1 + r / 30);
          setOneRepMax(Math.round(max));
      }
  };

  const calculateBMI = () => {
      const w = parseFloat(bmiWeight);
      const h = parseFloat(bmiHeight) / 100; // convert to meters
      if(w && h) {
          const bmi = w / (h * h);
          setBmiResult(parseFloat(bmi.toFixed(1)));
      }
  };

  return (
    <div className="min-h-screen bg-ains-black text-white p-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
                <ArrowLeft />
            </button>
            <h1 className="text-3xl font-display font-bold uppercase">Ferramentas</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-zinc-900 p-1 rounded-sm">
            <button 
                onClick={() => setActiveTab('1rm')}
                className={`flex-1 py-3 font-bold uppercase text-sm flex items-center justify-center gap-2 rounded-sm transition-colors ${activeTab === '1rm' ? 'bg-ains-primary text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Dumbbell size={16}/> 1RM Calc
            </button>
            <button 
                onClick={() => setActiveTab('bmi')}
                className={`flex-1 py-3 font-bold uppercase text-sm flex items-center justify-center gap-2 rounded-sm transition-colors ${activeTab === 'bmi' ? 'bg-ains-primary text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Activity size={16}/> IMC Calc
            </button>
        </div>

        {activeTab === '1rm' && (
            <div className="animate-fade-in space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
                    <h2 className="text-xl font-display font-bold uppercase mb-4 text-ains-primary">Estimativa de Carga Máxima</h2>
                    <p className="text-zinc-400 text-sm mb-6 font-mono">Descubra seu limite teórico de 1 repetição (1RM) baseado em suas séries atuais.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Carga Levantada (KG)</label>
                            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-black border border-zinc-700 p-4 text-white font-mono text-lg outline-none focus:border-ains-primary" placeholder="Ex: 60" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Repetições Feitas</label>
                            <input type="number" value={reps} onChange={e => setReps(e.target.value)} className="w-full bg-black border border-zinc-700 p-4 text-white font-mono text-lg outline-none focus:border-ains-primary" placeholder="Ex: 8" />
                        </div>
                        <button onClick={calculate1RM} className="w-full bg-zinc-800 border-2 border-zinc-700 text-white font-bold uppercase py-4 hover:border-ains-primary hover:text-ains-primary transition-colors">Calcular</button>
                    </div>
                </div>

                {oneRepMax !== null && (
                    <div className="bg-gradient-to-br from-ains-primary to-yellow-600 p-6 rounded-sm text-black shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                        <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Sua Força Máxima Estimada</div>
                        <div className="text-6xl font-display font-bold">{oneRepMax} <span className="text-2xl">KG</span></div>
                        
                        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                            <div className="bg-black/20 p-2 rounded">
                                <div className="text-xs font-bold">90%</div>
                                <div className="font-mono font-bold">{Math.round(oneRepMax * 0.9)}kg</div>
                            </div>
                             <div className="bg-black/20 p-2 rounded">
                                <div className="text-xs font-bold">80%</div>
                                <div className="font-mono font-bold">{Math.round(oneRepMax * 0.8)}kg</div>
                            </div>
                             <div className="bg-black/20 p-2 rounded">
                                <div className="text-xs font-bold">70%</div>
                                <div className="font-mono font-bold">{Math.round(oneRepMax * 0.7)}kg</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'bmi' && (
             <div className="animate-fade-in space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
                    <h2 className="text-xl font-display font-bold uppercase mb-4 text-ains-primary">Índice de Massa Corporal</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Seu Peso (KG)</label>
                            <input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} className="w-full bg-black border border-zinc-700 p-4 text-white font-mono text-lg outline-none focus:border-ains-primary" placeholder="Ex: 75" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Sua Altura (CM)</label>
                            <input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} className="w-full bg-black border border-zinc-700 p-4 text-white font-mono text-lg outline-none focus:border-ains-primary" placeholder="Ex: 175" />
                        </div>
                        <button onClick={calculateBMI} className="w-full bg-zinc-800 border-2 border-zinc-700 text-white font-bold uppercase py-4 hover:border-ains-primary hover:text-ains-primary transition-colors">Calcular IMC</button>
                    </div>
                </div>

                 {bmiResult !== null && (
                    <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-sm text-center">
                        <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Seu Resultado</div>
                        <div className={`text-6xl font-display font-bold ${bmiResult < 18.5 ? 'text-blue-400' : bmiResult < 25 ? 'text-green-400' : bmiResult < 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {bmiResult}
                        </div>
                        <div className="mt-2 text-lg font-bold uppercase text-white">
                            {bmiResult < 18.5 && "Abaixo do Peso"}
                            {bmiResult >= 18.5 && bmiResult < 25 && "Peso Normal"}
                            {bmiResult >= 25 && bmiResult < 30 && "Sobrepeso"}
                            {bmiResult >= 30 && "Obesidade"}
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
