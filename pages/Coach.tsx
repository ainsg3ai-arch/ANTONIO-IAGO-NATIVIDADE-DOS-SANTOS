
import React, { useState, useEffect, useRef } from 'react';
import { Send, BookOpen } from 'lucide-react';
import { getProfile } from '../services/storageService';
import { getAIChatResponse } from '../services/aiLogic';
import { UserProfile, ChatMessage } from '../types';

export const Coach: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [tab, setTab] = useState<'chat' | 'learn'>('chat');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setProfile(getProfile());
    // Welcome message
    setMessages([{
        id: 'init',
        sender: 'ai',
        text: 'Olá! Sou sua IA de treino. Dúvidas sobre execução, dieta ou precisa de motivação?',
        timestamp: Date.now()
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
      if (!input.trim() || !profile) return;
      
      const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: Date.now() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');

      // Simulate AI delay
      setTimeout(() => {
          const response = getAIChatResponse(userMsg.text, profile);
          setMessages(prev => [...prev, response]);
      }, 600);
  };

  return (
    <div className="flex flex-col h-screen bg-ains-black pb-20">
        {/* Header Tabs */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-10 pt-6">
            <h1 className="text-2xl font-bold text-white mb-4">Coach IA</h1>
            <div className="flex space-x-2 bg-zinc-800 p-1 rounded-2xl">
                <button onClick={() => setTab('chat')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'chat' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>Chat</button>
                <button onClick={() => setTab('learn')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'learn' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>Dicas & Artigos</button>
            </div>
        </div>

        {tab === 'chat' ? (
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-ains-primary text-black rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className="text-[10px] opacity-50 mt-1 block text-right font-bold">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center space-x-3 backdrop-blur-md">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pergunte sobre dieta, treino..."
                        className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-ains-primary/50 placeholder:text-zinc-500"
                    />
                    <button onClick={handleSend} disabled={!input.trim()} className="bg-ains-primary disabled:opacity-50 disabled:cursor-not-allowed p-4 rounded-xl text-black hover:scale-105 transition-transform shadow-lg shadow-lime-900/20">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="p-4 space-y-4 overflow-y-auto pb-24">
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <div className="flex items-center space-x-2 mb-3">
                        <BookOpen className="text-ains-primary" size={20} />
                        <h3 className="text-lg font-bold text-white">Sobrecarga Progressiva</h3>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">Para o músculo crescer, você precisa desafiá-lo constantemente. Não é apenas sobre adicionar peso. Você pode: fazer mais repetições, diminuir o tempo de descanso ou melhorar a técnica.</p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                     <div className="flex items-center space-x-2 mb-3">
                        <BookOpen className="text-ains-primary" size={20} />
                        <h3 className="text-lg font-bold text-white">Déficit Calórico</h3>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">Não adianta treinar se você come mais do que gasta. Para secar, mantenha um déficit de 300-500kcal. Use aplicativos para contar ou reduza porções visivelmente.</p>
                </div>
                
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                     <div className="flex items-center space-x-2 mb-3">
                        <BookOpen className="text-ains-primary" size={20} />
                        <h3 className="text-lg font-bold text-white">Sono & Recuperação</h3>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">Seus músculos crescem quando você dorme, não quando treina. O treino quebra as fibras, o descanso as reconstrói mais fortes. Mire em 7-8 horas por noite.</p>
                </div>

                 <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                     <div className="flex items-center space-x-2 mb-3">
                        <BookOpen className="text-ains-primary" size={20} />
                        <h3 className="text-lg font-bold text-white">Hidratação</h3>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">Um músculo desidratado perde até 20% da força. Beba água logo ao acordar e durante o treino. A cor da urina deve ser amarelo claro.</p>
                </div>
            </div>
        )}
    </div>
  );
};
