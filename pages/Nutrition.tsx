import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/storageService';
import { UserProfile } from '../types';
import { Calculator, ScanLine, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Nutrition: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<string | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (p) setProfile(p);
  }, []);

  const handleScan = () => {
      setIsScanning(true);
      // Simulate scan delay
      setTimeout(() => {
          setIsScanning(false);
          setScannedItem("Whey Protein (30g) - 120kcal");
      }, 2000);
  };

  if (!profile) return null;

  return (
    <div className="p-6 min-h-screen bg-ains-black pb-24 text-white">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')}><ArrowLeft className="text-zinc-400"/></button>
            <h1 className="text-3xl font-display font-bold uppercase">Nutrição</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-ains-primary uppercase">Scanner</h2>
                <p className="text-xs text-zinc-500">Registre alimentos via código de barras.</p>
            </div>
            <button onClick={handleScan} className="bg-zinc-800 p-4 rounded-full border border-zinc-700 hover:border-white transition-colors">
                {isScanning ? <ScanLine className="animate-pulse text-ains-primary"/> : <Camera />}
            </button>
        </div>

        {scannedItem && (
            <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-sm mb-6 animate-fade-in">
                <span className="text-green-400 text-xs font-bold uppercase">Detectado:</span>
                <div className="font-bold text-lg">{scannedItem}</div>
                <button onClick={() => setScannedItem(null)} className="text-xs underline mt-2 text-zinc-400">Registrar outro</button>
            </div>
        )}

        <div className="bg-zinc-900 p-4 rounded-sm border border-zinc-800">
            <div className="flex justify-between mb-2"><span className="text-zinc-400">Meta Calórica</span><span className="font-bold">2500</span></div>
            <div className="w-full bg-black h-2 rounded-full overflow-hidden"><div className="bg-ains-primary w-3/4 h-full"></div></div>
        </div>
    </div>
  );
};