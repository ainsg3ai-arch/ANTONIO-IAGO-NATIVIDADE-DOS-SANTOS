
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Swords, Copy } from 'lucide-react';

export const Battle: React.FC = () => {
  const navigate = useNavigate();
  const [challengeCode, setChallengeCode] = useState('');

  const createChallenge = () => {
      // Generate a random code representing a workout seed
      const code = `BATTLE-${Math.floor(Math.random() * 10000)}`;
      setChallengeCode(code);
  };

  return (
    <div className="min-h-screen bg-ains-black text-white p-6 pb-24">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')}><ArrowLeft className="text-zinc-400"/></button>
            <h1 className="text-2xl font-display font-bold uppercase">Arena de Batalha</h1>
        </div>

        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 p-8 rounded-sm text-center mb-8">
            <Swords size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold uppercase mb-2">Desafie um Amigo</h2>
            <p className="text-zinc-400 text-sm mb-6">Crie um desafio de repetições máximas e envie o código.</p>
            
            {challengeCode ? (
                <div className="bg-black p-4 rounded border border-zinc-700 flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-ains-primary tracking-widest">{challengeCode}</span>
                    <button onClick={() => navigator.clipboard.writeText(challengeCode)}><Copy size={20} className="text-zinc-400 hover:text-white"/></button>
                </div>
            ) : (
                <button onClick={createChallenge} className="bg-red-600 text-white font-bold uppercase px-8 py-3 rounded-sm hover:bg-red-500">Criar Duelo</button>
            )}
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase">Entrar em Duelo</h3>
            <div className="flex gap-2">
                <input className="flex-1 bg-zinc-900 border border-zinc-800 p-3 text-white outline-none placeholder-zinc-600 uppercase font-mono" placeholder="CÓDIGO DO RIVAL" />
                <button className="bg-zinc-800 text-white font-bold uppercase px-6 rounded-sm border border-zinc-700">Lutar</button>
            </div>
        </div>
    </div>
  );
};
