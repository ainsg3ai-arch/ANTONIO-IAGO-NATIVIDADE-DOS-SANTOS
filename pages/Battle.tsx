
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Swords, Copy, Trophy, AlertTriangle } from 'lucide-react';
import { addXP } from '../services/storageService';
import { playTone } from '../services/audioService';

export const Battle: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'menu' | 'setup' | 'result'>('menu');
  const [myScore, setMyScore] = useState('');
  const [rivalScore, setRivalScore] = useState('');
  const [winner, setWinner] = useState<'me' | 'rival' | 'draw' | null>(null);

  const calculateResult = () => {
      const my = parseInt(myScore);
      const rival = parseInt(rivalScore);

      if (isNaN(my) || isNaN(rival)) {
          alert("Insira os valores válidos!");
          return;
      }

      setMode('result');
      if (my > rival) {
          setWinner('me');
          addXP(300); // Winner Bonus
          playTone('success');
      } else if (rival > my) {
          setWinner('rival');
          addXP(50); // Participation
      } else {
          setWinner('draw');
          addXP(100);
      }
  };

  return (
    <div className="min-h-screen bg-ains-black text-white p-6 pb-24 font-sans">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')}><ArrowLeft className="text-zinc-400"/></button>
            <h1 className="text-2xl font-display font-bold uppercase">Arena PvP</h1>
        </div>

        {mode === 'menu' && (
            <div className="space-y-6 animate-slide-up">
                <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 p-8 rounded-xl text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-noise opacity-10"></div>
                    <Swords size={64} className="text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    <h2 className="text-2xl font-display font-bold uppercase mb-2">Duelo Offline</h2>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        Desafie um amigo para max reps (flexões, burpees, etc). 
                        Façam o exercício e insiram os resultados aqui para definir o vencedor.
                    </p>
                    <button onClick={() => setMode('setup')} className="bg-red-600 text-white font-bold uppercase px-8 py-4 rounded-xl hover:bg-red-500 shadow-neon-red w-full">
                        INICIAR COMBATE
                    </button>
                </div>

                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Como funciona?</h3>
                    <ul className="space-y-3 text-sm text-zinc-300">
                        <li className="flex gap-3"><span className="text-ains-primary font-bold">1.</span> Escolham um exercício (Ex: Flexões em 1 min).</li>
                        <li className="flex gap-3"><span className="text-ains-primary font-bold">2.</span> Gravem ou executem ao mesmo tempo.</li>
                        <li className="flex gap-3"><span className="text-ains-primary font-bold">3.</span> Insira os números aqui. A IA decide o XP.</li>
                    </ul>
                </div>
            </div>
        )}

        {mode === 'setup' && (
            <div className="animate-fade-in max-w-sm mx-auto mt-8">
                <h2 className="text-center font-display font-bold text-2xl uppercase mb-8 text-white">Resultados</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-ains-primary mb-2">Suas Repetições</label>
                        <input 
                            type="number" 
                            value={myScore}
                            onChange={e => setMyScore(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 p-5 rounded-xl text-3xl font-bold text-center text-white focus:border-ains-primary outline-none"
                            placeholder="0"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-center text-zinc-600 font-display font-bold text-xl italic">VS</div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-red-500 mb-2">Repetições do Rival</label>
                        <input 
                            type="number" 
                            value={rivalScore}
                            onChange={e => setRivalScore(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 p-5 rounded-xl text-3xl font-bold text-center text-white focus:border-red-500 outline-none"
                            placeholder="0"
                        />
                    </div>

                    <button onClick={calculateResult} className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:scale-105 transition-transform mt-8">
                        CALCULAR VENCEDOR
                    </button>
                    
                    <button onClick={() => setMode('menu')} className="w-full text-zinc-500 text-xs font-bold uppercase py-2">Cancelar</button>
                </div>
            </div>
        )}

        {mode === 'result' && (
            <div className="flex flex-col items-center justify-center animate-slide-up mt-10 text-center">
                {winner === 'me' && (
                    <>
                        <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] animate-bounce" />
                        <h2 className="text-5xl font-display font-bold uppercase italic text-white mb-2">VITÓRIA!</h2>
                        <p className="text-zinc-400 mb-8">Você esmagou seu oponente.</p>
                        <div className="bg-zinc-900 px-6 py-3 rounded-full border border-yellow-600 text-yellow-500 font-bold mb-8 shadow-lg">
                            +300 XP
                        </div>
                    </>
                )}
                {winner === 'rival' && (
                    <>
                        <AlertTriangle size={80} className="text-red-500 mb-6 opacity-80" />
                        <h2 className="text-4xl font-display font-bold uppercase italic text-zinc-500 mb-2">DERROTA...</h2>
                        <p className="text-zinc-400 mb-8">Treine mais e tente novamente.</p>
                        <div className="bg-zinc-900 px-6 py-3 rounded-full border border-zinc-700 text-zinc-500 font-bold mb-8">
                            +50 XP (Honra)
                        </div>
                    </>
                )}
                {winner === 'draw' && (
                    <>
                        <Swords size={80} className="text-blue-400 mb-6" />
                        <h2 className="text-4xl font-display font-bold uppercase italic text-white mb-2">EMPATE</h2>
                        <p className="text-zinc-400 mb-8">Uma batalha lendária.</p>
                        <div className="bg-zinc-900 px-6 py-3 rounded-full border border-blue-600 text-blue-400 font-bold mb-8">
                            +100 XP
                        </div>
                    </>
                )}

                <div className="w-full space-y-3">
                    <button onClick={() => { setMyScore(''); setRivalScore(''); setMode('setup'); }} className="w-full bg-ains-primary text-black font-bold uppercase py-4 rounded-xl">
                        Revanche
                    </button>
                    <button onClick={() => navigate('/')} className="w-full bg-zinc-900 text-white font-bold uppercase py-4 rounded-xl border border-zinc-800">
                        Voltar ao Menu
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};
