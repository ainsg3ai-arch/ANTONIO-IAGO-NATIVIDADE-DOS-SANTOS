
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { UserProfile, Goal, Equipment, ExperienceLevel } from '../types';
import { saveProfile } from '../services/storageService';
import { Activity, Target, Dumbbell, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  // Step 0 is the Splash/Welcome screen
  const [step, setStep] = useState(0); 
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    weight: 70,
    height: 175,
    goal: Goal.LOSE_WEIGHT,
    level: ExperienceLevel.BEGINNER,
    equipment: Equipment.NONE,
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finish
      const finalProfile = { ...profile, onboarded: true } as UserProfile;
      saveProfile(finalProfile);
      navigate('/');
    }
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  // --- STEP 0: WELCOME SCREEN ---
  if (step === 0) {
    return (
      <div className="min-h-screen bg-ains-black relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-ains-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-ains-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="z-10 flex flex-col items-center animate-fade-in">
          <Logo size={120} className="mb-8" />
          
          <p className="text-xl font-medium text-white max-w-xs leading-relaxed mb-2">
            Supere seus limites.
          </p>
          <p className="text-lg text-zinc-400 max-w-xs mb-12">
            Sem internet. Sem desculpas.
          </p>

          <div className="w-full max-w-xs space-y-4">
             <Button onClick={() => setStep(1)} fullWidth className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>COMEÇAR AGORA</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
             </Button>
             <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">100% Offline • Gratuito</p>
          </div>
        </div>
      </div>
    );
  }

  // --- STEPS 1-4: FORM ---
  return (
    <div className="min-h-screen bg-ains-black p-6 flex flex-col justify-between max-w-md mx-auto">
      <div className="mt-8 animate-fade-in">
        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 h-1 rounded-full mb-8">
          <div 
            className="bg-ains-primary h-1 rounded-full transition-all duration-300 shadow-[0_0_10px_#a3e635]"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
          {step === 1 && "Vamos nos conhecer"}
          {step === 2 && "Qual seu objetivo principal?"}
          {step === 3 && "Quais equipamentos você tem?"}
          {step === 4 && "Detalhes físicos"}
        </h1>
        <p className="text-ains-muted mb-8">
          {step === 1 && "Isso ajuda a IA a personalizar sua experiência."}
          {step === 2 && "Vamos adaptar a intensidade com base nisso."}
          {step === 3 && "Sem academia? Sem problemas."}
          {step === 4 && "Usado para cálculos de calorias."}
        </p>

        {/* Step 1: Name & Level */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-ains-muted mb-2 font-bold uppercase tracking-wider">Seu Nome</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-ains-primary transition-colors text-lg"
                placeholder="Ex. Alex"
                autoFocus
              />
            </div>
            <div className="pt-4">
              <label className="block text-sm text-ains-muted mb-2 font-bold uppercase tracking-wider">Nível de Experiência</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(ExperienceLevel).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => updateProfile('level', lvl)}
                    className={`p-4 rounded-xl text-left border transition-all flex justify-between items-center ${profile.level === lvl ? 'border-ains-primary bg-ains-primary/10 text-white shadow-lg shadow-lime-900/20' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                  >
                    <span className="font-medium">{lvl}</span>
                    {profile.level === lvl && <div className="w-3 h-3 bg-ains-primary rounded-full shadow-[0_0_8px_#a3e635]"></div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-4">
            {Object.values(Goal).map((g) => (
              <button
                key={g}
                onClick={() => updateProfile('goal', g)}
                className={`p-6 rounded-2xl flex items-center space-x-4 border transition-all ${profile.goal === g ? 'border-ains-primary bg-ains-primary text-ains-black shadow-lg shadow-lime-500/20' : 'border-zinc-800 bg-zinc-900 text-white hover:border-zinc-600'}`}
              >
                <div className={`p-3 rounded-full ${profile.goal === g ? 'bg-black/10' : 'bg-zinc-800'}`}>
                  <Target size={24} />
                </div>
                <span className="font-bold text-lg">{g}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Equipment */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-4">
            {Object.values(Equipment).map((eq) => (
              <button
                key={eq}
                onClick={() => updateProfile('equipment', eq)}
                className={`p-6 rounded-2xl flex items-center space-x-4 border transition-all ${profile.equipment === eq ? 'border-ains-primary bg-ains-primary text-ains-black shadow-lg shadow-lime-500/20' : 'border-zinc-800 bg-zinc-900 text-white hover:border-zinc-600'}`}
              >
                <div className={`p-3 rounded-full ${profile.equipment === eq ? 'bg-black/10' : 'bg-zinc-800'}`}>
                  <Dumbbell size={24} />
                </div>
                <span className="font-bold text-lg">{eq}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Measurements */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
              <span className="text-ains-muted font-medium">Idade</span>
              <div className="flex items-center">
                <input 
                    type="number" 
                    value={profile.age}
                    onChange={(e) => updateProfile('age', Number(e.target.value))}
                    className="w-20 bg-transparent text-right text-3xl font-bold text-white focus:outline-none"
                />
                <span className="ml-2 text-zinc-500 text-sm">anos</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
              <span className="text-ains-muted font-medium">Peso</span>
              <div className="flex items-center">
                <input 
                    type="number" 
                    value={profile.weight}
                    onChange={(e) => updateProfile('weight', Number(e.target.value))}
                    className="w-24 bg-transparent text-right text-3xl font-bold text-white focus:outline-none"
                />
                <span className="ml-2 text-zinc-500 text-sm">kg</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
              <span className="text-ains-muted font-medium">Altura</span>
              <div className="flex items-center">
                <input 
                    type="number" 
                    value={profile.height}
                    onChange={(e) => updateProfile('height', Number(e.target.value))}
                    className="w-24 bg-transparent text-right text-3xl font-bold text-white focus:outline-none"
                />
                <span className="ml-2 text-zinc-500 text-sm">cm</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pb-8">
        <Button onClick={handleNext} fullWidth disabled={step === 1 && !profile.name} className="shadow-lg shadow-lime-900/20">
          {step === 4 ? 'Gerar Meu Plano' : 'Próximo'}
        </Button>
      </div>
    </div>
  );
};
