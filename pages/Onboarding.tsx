
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { UserProfile, Goal, Equipment, ExperienceLevel, Injury, CoachStyle } from '../types';
import { saveProfile, getProfile } from '../services/storageService';
import { Dumbbell, ArrowRight, ShieldAlert, Bot, ChevronLeft, Zap } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const [step, setStep] = useState(isEditMode ? 1 : 0); 
  
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
    gender: 'male',
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
      <div className="h-screen bg-ains-bg flex flex-col items-center justify-center p-8 relative overflow-hidden page-enter">
          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-ains-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="z-10 text-center">
              <Logo size={120} className="mb-16" />
              
              <div className="space-y-4 mb-16">
                  <h1 className="text-5xl font-display font-bold text-white uppercase italic leading-[0.85] tracking-tighter">
                      FORJE SUA<br/>
                      <span className="text-ains-primary">MELHOR VERSÃO</span>
                  </h1>
                  <p className="text-ains-muted font-bold text-xs tracking-[0.4em] uppercase">Protocolo de Treino Offline</p>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full max-w-xs mx-auto">
                  <Button onClick={() => setStep(1)} fullWidth className="text-lg py-5">
                      INICIAR JORNADA <ArrowRight className="ml-2" />
                  </Button>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">v2.5 Stable | No Data Required</p>
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-screen bg-ains-bg p-6 flex flex-col page-enter">
        <div className="flex justify-between items-center mb-10 pt-4">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : setStep(0)} className="text-zinc-500 hover:text-white transition-colors">
                <ChevronLeft size={28}/>
            </button>
            <div className="flex gap-1">
                {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full transition-all ${i+1 <= step ? 'bg-ains-primary' : 'bg-zinc-800'}`}></div>
                ))}
            </div>
        </div>

        <div className="flex-1">
            <header className="mb-10">
                <span className="text-ains-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block flex items-center gap-2">
                    <Zap size={12} fill="currentColor"/> Configuração de Perfil
                </span>
                <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter leading-none">
                    {step === 1 && "Identificação"}
                    {step === 2 && "Objetivo"}
                    {step === 3 && "Frequência"}
                    {step === 4 && "Duração"}
                    {step === 5 && "Equipamento"}
                    {step === 6 && "Biometria"}
                    {step === 7 && "Restrições"}
                    {step === 8 && "Coach"}
                </h2>
            </header>

            <div className="animate-fade-in">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="bg-ains-surface p-6 rounded-3xl border border-white/5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Como devemos te chamar?</label>
                            <input 
                                value={profile.name} 
                                onChange={e => update('name', e.target.value)} 
                                placeholder="DIGITE SEU NOME" 
                                className="w-full bg-transparent border-b-2 border-zinc-800 p-2 text-2xl font-display font-bold text-white focus:border-ains-primary outline-none uppercase placeholder-zinc-800"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.values(ExperienceLevel).map(l => (
                                <button 
                                    key={l} 
                                    onClick={() => update('level', l)} 
                                    className={`w-full p-5 text-left border-2 rounded-2xl transition-all ${profile.level === l ? 'bg-ains-primary border-ains-primary text-ains-bg' : 'bg-ains-surface border-zinc-800 text-zinc-500'} font-bold uppercase text-sm`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(Goal).map(g => (
                            <button 
                                key={g} 
                                onClick={() => update('goal', g)} 
                                className={`w-full p-6 text-left border-2 rounded-3xl transition-all ${profile.goal === g ? 'border-ains-primary text-white bg-ains-primary/10' : 'border-zinc-800 text-zinc-500'} font-display font-bold text-xl uppercase italic`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div className="grid grid-cols-2 gap-4">
                        {[2,3,4,5,6].map(d => (
                            <button 
                                key={d} 
                                onClick={() => update('workoutFrequency', d)} 
                                className={`aspect-square flex flex-col items-center justify-center border-2 rounded-3xl transition-all ${profile.workoutFrequency === d ? 'border-ains-primary bg-ains-primary text-ains-bg' : 'border-zinc-800 text-zinc-500'}`}
                            >
                                <span className="text-4xl font-display font-bold">{d}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Dias/Sem</span>
                            </button>
                        ))}
                    </div>
                )}

                {step === 4 && (
                    <div className="grid grid-cols-1 gap-4">
                        {[15,30,45,60].map(d => (
                            <button 
                                key={d} 
                                onClick={() => update('workoutDuration', d)} 
                                className={`w-full p-6 border-2 rounded-3xl transition-all font-display font-bold text-2xl uppercase italic ${profile.workoutDuration === d ? 'border-ains-primary text-ains-primary bg-ains-primary/5' : 'border-zinc-800 text-zinc-500'}`}
                            >
                                {d} Minutos
                            </button>
                        ))}
                    </div>
                )}

                {step === 5 && (
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(Equipment).map(e => {
                            const isSelected = profile.equipment?.includes(e);
                            return (
                                <button 
                                    key={e} 
                                    onClick={() => {
                                        const current = profile.equipment || [];
                                        const newItem = isSelected ? current.filter(i => i !== e) : [...current, e];
                                        update('equipment', newItem.length ? newItem : [Equipment.NONE]);
                                    }} 
                                    className={`w-full p-5 border-2 rounded-2xl transition-all ${isSelected ? 'bg-white border-white text-black' : 'bg-ains-surface border-zinc-800 text-zinc-500'} font-bold uppercase flex items-center gap-4`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-black/10' : 'bg-zinc-900'}`}>
                                        <Dumbbell size={18}/>
                                    </div>
                                    {e}
                                </button>
                            );
                        })}
                    </div>
                )}

                {step === 6 && (
                    <div className="space-y-6">
                        {[
                            { label: 'Idade', key: 'age', unit: 'Anos' },
                            { label: 'Peso', key: 'weight', unit: 'KG' },
                            { label: 'Altura', key: 'height', unit: 'CM' }
                        ].map(item => (
                            <div key={item.key} className="bg-ains-surface p-6 rounded-3xl border border-white/5 flex justify-between items-center">
                                <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={profile[item.key as keyof UserProfile] as number} 
                                        onChange={e => update(item.key as keyof UserProfile, Number(e.target.value))} 
                                        className="bg-transparent text-right text-3xl font-display font-bold text-white outline-none w-20"
                                    />
                                    <span className="text-ains-primary font-bold text-xs uppercase">{item.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 7 && (
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(Injury).map(i => {
                            const active = profile.injuries?.includes(i);
                            return (
                                <button 
                                    key={i} 
                                    onClick={() => {
                                        let news = active ? profile.injuries?.filter(x => x !== i) : [...(profile.injuries || []), i];
                                        if(!news?.length) news = [Injury.NONE];
                                        update('injuries', news);
                                    }} 
                                    className={`w-full p-5 border-2 rounded-2xl transition-all flex items-center justify-between ${active ? 'border-ains-accent text-ains-accent bg-ains-accent/5' : 'border-zinc-800 text-zinc-500'} font-bold uppercase`}
                                >
                                    <div className="flex gap-4 items-center">
                                        <ShieldAlert size={20}/> 
                                        <span>{i}</span>
                                    </div>
                                    {active && <Zap size={16} fill="currentColor" />}
                                </button>
                            )
                        })}
                    </div>
                )}

                {step === 8 && (
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(CoachStyle).map(s => (
                            <button 
                                key={s} 
                                onClick={() => update('coachStyle', s)} 
                                className={`w-full p-6 border-2 rounded-3xl transition-all ${profile.coachStyle === s ? 'border-ains-primary text-ains-primary bg-ains-primary/5' : 'border-zinc-800 text-zinc-500'} font-display font-bold text-xl uppercase italic flex items-center gap-4`}
                            >
                                <Bot size={24}/> {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="pb-10">
            <Button onClick={handleNext} fullWidth disabled={step===1 && !profile.name} className="py-5 shadow-neon">
                {step === 8 ? (isEditMode ? 'SALVAR ALTERAÇÕES' : 'CONCLUIR PROTOCOLO') : 'PRÓXIMO PASSO'}
            </Button>
        </div>
    </div>
  );
};
