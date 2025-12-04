
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, Check } from 'lucide-react';
import { getProfile, getInventory, buyItem, equipItem } from '../services/storageService';
import { UserProfile, InventoryItem } from '../types';
import { STORE_ITEMS } from '../constants';

export const Store: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
      refreshData();
  }, []);

  const refreshData = () => {
      setProfile(getProfile());
      setInventory(getInventory());
  }

  const handleBuy = (itemId: string) => {
      if (buyItem(itemId)) {
          alert("Item comprado!");
          refreshData();
      } else {
          alert("Moedas insuficientes!");
      }
  }

  const handleEquip = (itemId: string) => {
      equipItem(itemId);
      alert("Equipado!");
      refreshData();
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-ains-black text-white p-6 pb-24">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/')}><ArrowLeft className="text-zinc-400"/></button>
                <h1 className="text-2xl font-display font-bold uppercase">Loja AINS</h1>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-yellow-600">
                <Coins size={20} className="text-yellow-500" />
                <span className="font-mono font-bold text-yellow-500">{profile.coins || 0}</span>
            </div>
        </div>

        <div className="space-y-4">
            {STORE_ITEMS.map(item => {
                const owned = inventory.some(i => i.itemId === item.id);
                const equipped = profile.equippedSkin === item.preview;

                return (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-sm flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-zinc-700" style={{backgroundColor: item.preview}}></div>
                            <div>
                                <h3 className="font-bold uppercase text-sm">{item.name}</h3>
                                <p className="text-xs text-zinc-500">{item.description}</p>
                            </div>
                        </div>
                        <div>
                            {owned ? (
                                <button 
                                    onClick={() => handleEquip(item.id)}
                                    disabled={equipped}
                                    className={`px-4 py-2 text-xs font-bold uppercase rounded-sm ${equipped ? 'bg-green-900 text-green-400 border border-green-700' : 'bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700'}`}
                                >
                                    {equipped ? <span className="flex items-center gap-1"><Check size={12}/> Equipado</span> : 'Equipar'}
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleBuy(item.id)}
                                    className="flex items-center gap-1 bg-yellow-600 text-black px-4 py-2 text-xs font-bold uppercase rounded-sm hover:bg-yellow-500"
                                >
                                    <Coins size={12}/> {item.cost}
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  );
};
