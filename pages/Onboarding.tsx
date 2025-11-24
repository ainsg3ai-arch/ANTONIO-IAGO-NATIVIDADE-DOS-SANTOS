import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { UserProfile, Goal, Equipment, ExperienceLevel } from '../types';
import { saveProfile } from '../services/storageService';
import { Activity, Target, Dumbbell } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  return (
    <div className="min-h-screen bg-ains-black p-6 flex flex-col justify-between max-w-md mx-auto">
      <div className="mt-8">
        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 h-1 rounded-full mb-8">
          <div 
            className="bg-ains-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ains-muted mb-2">Seu Nome</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-ains-primary"
                placeholder="Ex. Alex"
              />
            </div>
            <div className="pt-4">
              <label className="block text-sm text-ains-muted mb-2">Nível de Experiência</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(ExperienceLevel).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => updateProfile('level', lvl)}
                    className={`p-4 rounded-xl text-left border transition-all ${profile.level === lvl ? 'border-ains-primary bg-ains-primary/10 text-white' : 'border-zinc-800 bg-zinc-900 text-zinc-400'}`}
                  >
                    {lvl}
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
                className={`p-6 rounded-2xl flex items-center space-x-4 border transition-all ${profile.goal === g ? 'border-ains-primary bg-ains-primary text-ains-black' : 'border-zinc-800 bg-zinc-900 text-white'}`}
              >
                <div className={`p-2 rounded-full ${profile.goal === g ? 'bg-black/10' : 'bg-zinc-800'}`}>
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
                className={`p-6 rounded-2xl flex items-center space-x-4 border transition-all ${profile.equipment === eq ? 'border-ains-primary bg-ains-primary text-ains-black' : 'border-zinc-800 bg-zinc-900 text-white'}`}
              >
                <div className={`p-2 rounded-full ${profile.equipment === eq ? 'bg-black/10' : 'bg-zinc-800'}`}>
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
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <span className="text-ains-muted">Idade</span>
              <input 
                type="number" 
                value={profile.age}
                onChange={(e) => updateProfile('age', Number(e.target.value))}
                className="w-20 bg-transparent text-right text-2xl font-bold text-white focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <span className="text-ains-muted">Peso (kg)</span>
              <input 
                type="number" 
                value={profile.weight}
                onChange={(e) => updateProfile('weight', Number(e.target.value))}
                className="w-20 bg-transparent text-right text-2xl font-bold text-white focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <span className="text-ains-muted">Altura (cm)</span>
              <input 
                type="number" 
                value={profile.height}
                onChange={(e) => updateProfile('height', Number(e.target.value))}
                className="w-20 bg-transparent text-right text-2xl font-bold text-white focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="pb-8">
        <Button onClick={handleNext} fullWidth disabled={step === 1 && !profile.name}>
          {step === 4 ? 'Concluir' : 'Próximo'}
        </Button>
      </div>
    </div>
  );
};