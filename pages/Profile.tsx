import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getUnlockedAchievements } from '../services/storageService';
import { UserProfile, UserAchievement } from '../types';
import { ACHIEVEMENTS_LIST } from '../constants';
import { Settings, LogOut, Lock } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([]);

  useEffect(() => {
    setProfile(getProfile());
    setUnlocked(getUnlockedAchievements());
  }, []);

  const handleReset = () => {
      if(window.confirm("Isso apagará seus dados locais e reiniciará o aplicativo. Tem certeza?")) {
          localStorage.clear();
          window.location.reload();
      }
  }

  if (!profile) return null;

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-20 h-20 bg-zinc-800 rounded-full overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="avatar" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-ains-primary font-medium">{profile.level} • {profile.goal}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
          <div className="bg-zinc-900 rounded-xl p-4 flex justify-between items-center">
              <span className="text-zinc-400">Peso</span>
              <span className="text-white font-bold">{profile.weight} kg</span>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 flex justify-between items-center">
              <span className="text-zinc-400">Altura</span>
              <span className="text-white font-bold">{profile.height} cm</span>
          </div>
           <div className="bg-zinc-900 rounded-xl p-4 flex justify-between items-center">
              <span className="text-zinc-400">Equipamento</span>
              <span className="text-white font-bold text-sm">{profile.equipment}</span>
          </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
          <h3 className="text-white font-bold text-lg mb-4">Suas Conquistas</h3>
          <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENTS_LIST.map((ach) => {
                  const isUnlocked = unlocked.find(u => u.achievementId === ach.id);
                  const Icon = ach.icon;
                  
                  return (
                      <div key={ach.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center border transition-all ${isUnlocked ? 'bg-zinc-900 border-ains-primary/30' : 'bg-zinc-900/50 border-zinc-800 grayscale opacity-60'}`}>
                          <div className={`p-2 rounded-full mb-2 ${isUnlocked ? 'bg-ains-primary/20 text-ains-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                              {isUnlocked ? <Icon size={20} /> : <Lock size={20} />}
                          </div>
                          <span className="text-[10px] font-bold text-zinc-300 leading-tight">{ach.title}</span>
                      </div>
                  )
              })}
          </div>
      </div>

      <div className="space-y-4">
          <button 
            onClick={() => navigate('/onboarding?mode=edit')}
            className="w-full bg-zinc-800 text-white p-4 rounded-xl flex items-center space-x-3 hover:bg-zinc-700 transition-colors"
          >
              <Settings size={20} />
              <span>Configurações / Editar Perfil</span>
          </button>
          
          <button onClick={handleReset} className="w-full bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center space-x-3 hover:bg-red-500/20 transition-colors">
              <LogOut size={20} />
              <span>Resetar Dados</span>
          </button>
      </div>
    </div>
  );
};