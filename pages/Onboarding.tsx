
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { UserProfile, Goal, Equipment, ExperienceLevel, Injury, CoachStyle } from '../types';
import { saveProfile, getProfile } from '../services/storageService';
import { Dumbbell, ArrowRight, ShieldAlert, Bot, ChevronLeft } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const [step, setStep] = useState(isEditMode ? 1 : 0); 
  
  // Inicialização completa para evitar erros de tipagem estrita
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '', 
    age: 25, 
    weight: 70, 
    height: 175, 
    goal: Goal.LOSE_WEIGHT, 
    level: ExperienceLevel.BEGINNER,
    equipment: [Equipment.NONE], 
    injuries: [Injury.NONE], 
    coachStyle: CoachStyle.FRIENDLY,
    workoutDuration: 45, 
    workoutFrequency: 3,
    gender: 'male', // Default
    xp: 0,
    coins: 0,
    campaignProgress: 1,
    onboarded: false
  });

  useEffect(() => {
    const existing = getProfile();
    if (existing?.onboarded && !isEditMode) navigate('/');
    if (isEditMode && existing) setProfile(existing);
  }, []);

  const handleNext = () => {
    if (step < 8) setStep(step + 1);
    else {
      // Garantir que todos os campos obrigatórios existam ao salvar
      const finalProfile: UserProfile = {
          ...profile,
          gender: profile.gender || 'male',
          xp: profile.xp || 0,
          coins: profile.coins || 0,
          campaignProgress: profile.campaignProgress || 1,
          onboarded: true
      } as UserProfile;

      saveProfile(finalProfile);
      navigate(isEditMode ? '/profile' : '/');
    }
  };

  const update = (k: keyof UserProfile, v: any) => setProfile(p => ({ ...p, [k]: v }));

  if (step === 0 && !isEditMode) return (
      <div className="h-screen bg-ains-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Noise overlay removed */}
          <div className="z-10 text-center animate-fade-in">
              <Logo size={100} className="mb-12" />
              <h1 className="text-5xl font-display font-bold text-white uppercase mb-4 leading-none">Domine<br/><span className="text-ains-primary">Seu Corpo</span></h1>
              <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase mb-12">Sem Internet. Sem Limites.</p>
              <Button onClick={() => setStep(1)} fullWidth className="text-lg py-5 flex items-center justify-center gap-2">INICIAR <ArrowRight/></Button>
          </div>
      </div>
  );

  return (
    <div className="h-screen bg-ains-black p-6 flex flex-col">
        <div className="flex justify-between items-center mb-8">
            <button onClick={() => setStep(s => s - 1)} className="text-zinc-500 hover:text-white"><ChevronLeft/></button>
            <div className="text-xs font-mono text-ains-primary">PASSO {step}/8</div>
        </div>

        <div className="flex-1 animate-fade-in">
            <h2 className="text-3xl font-display font-bold text-white uppercase mb-2">
                {step === 1 && "Quem é você?"}
                {step === 2 && "Qual a missão?"}
                {step === 3 && "Frequência"}
                {step === 4 && "Tempo de Treino"}
                {step === 5 && "Arsenal"}
                {step === 6 && "Medidas"}
                {step === 7 && "Áreas de Risco"}
                {step === 8 && "Estilo do Coach"}
            </h2>
            <p className="text-zinc-500 text-sm mb-8 font-mono uppercase tracking-wide">Configure seu protocolo.</p>

            {step === 1 && (
                <div className="space-y-4">
                    <input value={profile.name} onChange={e => update('name', e.target.value)} placeholder="SEU NOME" className="w-full bg-zinc-900 border-b-2 border-zinc-700 p-4 text-2xl font-bold text-white focus:border-ains-primary outline-none uppercase placeholder-zinc-700"/>
                    <div className="space-y-2">
                        {Object.values(ExperienceLevel).map(l => (
                            <button key={l} onClick={() => update('level', l)} className={`w-full p-4 text-left border rounded-sm ${profile.level === l ? 'bg-ains-primary border-ains-primary text-black' : 'bg-transparent border-zinc-800 text-zinc-500'} font-bold uppercase transition-colors`}>{l}</button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-2">
                    {Object.values(Goal).map(g => (
                        <button key={g} onClick={() => update('goal', g)} className={`w-full p-6 text-left border-2 rounded-sm ${profile.goal === g ? 'border-ains-primary text-white bg-ains-primary/10' : 'border-zinc-800 text-zinc-500'} font-display font-bold text-xl uppercase`}>{g}</button>
                    ))}
                </div>
            )}

            {step === 3 && (
                <div className="grid grid-cols-4 gap-4">
                    {[2,3,4,5].map(d => (
                        <button key={d} onClick={() => update('workoutFrequency', d)} className={`aspect-square flex items-center justify-center text-2xl font-bold border-2 rounded-sm ${profile.workoutFrequency === d ? 'border-ains-primary bg-ains-primary text-black' : 'border-zinc-800 text-zinc-500'}`}>{d}x</button>
                    ))}
                </div>
            )}
             {step === 4 && (
                <div className="space-y-2">
                    {[15,30,45,60].map(d => (
                        <button key={d} onClick={() => update('workoutDuration', d)} className={`w-full p-4 border-2 rounded-sm ${profile.workoutDuration === d ? 'border-ains-primary text-white' : 'border-zinc-800 text-zinc-500'} font-mono font-bold text-lg`}>{d} MIN</button>
                    ))}
                </div>
            )}
            {step === 5 && (
                 <div className="space-y-2">
                    {Object.values(Equipment).map(e => {
                        const isSelected = profile.equipment?.includes(e);
                        return (
                            <button key={e} onClick={() => {
                                const current = profile.equipment || [];
                                const newItem = isSelected ? current.filter(i => i !== e) : [...current, e];
                                update('equipment', newItem.length ? newItem : [Equipment.NONE]);
                            }} className={`w-full p-4 border rounded-sm ${isSelected ? 'bg-zinc-800 border-white text-white' : 'bg-transparent border-zinc-800 text-zinc-500'} font-bold uppercase flex items-center gap-2`}><Dumbbell size={16}/> {e}</button>
                        );
                    })}
                </div>
            )}
            {step === 6 && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500 font-bold uppercase">Idade</span>
                        <input type="number" value={profile.age} onChange={e => update('age', Number(e.target.value))} className="bg-transparent text-right text-3xl font-bold text-white outline-none w-20"/>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500 font-bold uppercase">Peso (kg)</span>
                        <input type="number" value={profile.weight} onChange={e => update('weight', Number(e.target.value))} className="bg-transparent text-right text-3xl font-bold text-white outline-none w-24"/>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500 font-bold uppercase">Altura (cm)</span>
                        <input type="number" value={profile.height} onChange={e => update('height', Number(e.target.value))} className="bg-transparent text-right text-3xl font-bold text-white outline-none w-24"/>
                    </div>
                </div>
            )}
            {step === 7 && (
                <div className="space-y-2">
                     {Object.values(Injury).map(i => {
                         const active = profile.injuries?.includes(i);
                         return <button key={i} onClick={() => {
                             let news = active ? profile.injuries?.filter(x => x !== i) : [...(profile.injuries || []), i];
                             if(!news?.length) news = [Injury.NONE];
                             update('injuries', news);
                         }} className={`w-full p-4 border rounded-sm flex items-center justify-between ${active ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-zinc-800 text-zinc-500'} font-bold uppercase`}><div className="flex gap-2"><ShieldAlert size={18}/> {i}</div></button>
                     })}
                </div>
            )}
            {step === 8 && (
                 <div className="space-y-2">
                    {Object.values(CoachStyle).map(s => (
                        <button key={s} onClick={() => update('coachStyle', s)} className={`w-full p-4 border rounded-sm ${profile.coachStyle === s ? 'border-ains-primary text-ains-primary' : 'border-zinc-800 text-zinc-500'} font-bold uppercase flex items-center gap-2`}><Bot size={18}/> {s}</button>
                    ))}
                </div>
            )}

        </div>
        <Button onClick={handleNext} fullWidth disabled={step===1 && !profile.name} className="mt-4">
            {step === 8 ? (isEditMode ? 'SALVAR TUDO' : 'FINALIZAR') : 'AVANÇAR'}
        </Button>
    </div>
  );
};
