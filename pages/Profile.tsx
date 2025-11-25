import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getUnlockedAchievements, exportData, importData } from '../services/storageService';
import { UserProfile, UserAchievement } from '../types';
import { ACHIEVEMENTS_LIST } from '../constants';
import { Settings, Lock, Download, LogOut, Upload } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [unlocked, setUnlocked] = useState<UserAchievement[]>([]);

  useEffect(() => {
    setProfile(getProfile());
    setUnlocked(getUnlockedAchievements());
  }, []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && confirm("Importar dados sobrescreverá o progresso atual. Continuar?")) {
         const success = await importData(file);
         if (success) window.location.reload();
      }
  }

  if (!profile) return null;

  return (
    <div className="p-6 min-h-screen bg-ains-black">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-6 mb-8">
            <div>
                <h1 className="text-4xl font-display font-bold text-white uppercase">{profile.name}</h1>
                <p className="text-ains-primary font-mono text-sm tracking-widest uppercase">Nível: {profile.level}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-700 p-2 rounded-sm">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}&backgroundColor=18181b`} className="w-12 h-12 grayscale" />
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-center rounded-sm">
                <div className="text-2xl font-bold text-white">{profile.weight}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">KG</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-center rounded-sm">
                <div className="text-2xl font-bold text-white">{profile.height}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">CM</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-center rounded-sm">
                <div className="text-2xl font-bold text-white">{profile.age}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Anos</div>
            </div>
        </div>

        <h3 className="text-white font-display font-bold uppercase mb-4 text-lg">Conquistas</h3>
        <div className="grid grid-cols-4 gap-2 mb-8">
            {ACHIEVEMENTS_LIST.map(ach => {
                const isUnlocked = unlocked.find(u => u.achievementId === ach.id);
                const Icon = ach.icon;
                return (
                    <div key={ach.id} className={`aspect-square flex flex-col items-center justify-center border rounded-sm ${isUnlocked ? 'bg-ains-primary/10 border-ains-primary text-ains-primary' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
                        {isUnlocked ? <Icon size={20}/> : <Lock size={16}/>}
                    </div>
                )
            })}
        </div>

        <h3 className="text-white font-display font-bold uppercase mb-4 text-lg">Sistema</h3>
        <div className="space-y-2 pb-24">
            <button onClick={() => navigate('/onboarding?mode=edit')} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-left text-white font-bold uppercase hover:border-white transition-colors flex items-center justify-between rounded-sm">
                <span>Editar Perfil</span> <Settings size={18}/>
            </button>
            <div className="grid grid-cols-2 gap-2">
                 <button onClick={exportData} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-left text-white font-bold uppercase hover:border-white transition-colors flex flex-col items-center justify-center rounded-sm">
                    <Download size={18} className="mb-2"/> <span>Backup</span>
                </button>
                <label className="w-full bg-zinc-900 border border-zinc-800 p-4 text-left text-white font-bold uppercase hover:border-white transition-colors flex flex-col items-center justify-center rounded-sm cursor-pointer">
                    <Upload size={18} className="mb-2"/> <span>Restaurar</span>
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
            </div>
             <button onClick={() => { if(confirm("Apagar tudo?")) { localStorage.clear(); window.location.reload() }}} className="w-full bg-red-900/20 border border-red-900/50 p-4 text-left text-red-500 font-bold uppercase hover:bg-red-900/40 transition-colors flex items-center justify-between rounded-sm">
                <span>Resetar App</span> <LogOut size={18}/>
            </button>
        </div>
    </div>
  );
};