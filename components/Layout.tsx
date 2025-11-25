import React from 'react';
import { Home, Dumbbell, BarChart2, User, Play, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNav = location.pathname === '/workout-active' || location.pathname === '/onboarding';

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${isActive ? 'text-ains-primary' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        <Icon size={22} strokeWidth={isActive ? 3 : 2} />
        <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-ains-black text-ains-text overflow-hidden font-sans selection:bg-ains-primary selection:text-black">
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </main>

      {!hideNav && (
        <div className="fixed bottom-4 left-4 right-4 h-16 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl flex items-center justify-between px-2 shadow-2xl z-50">
          <NavItem path="/" icon={Home} label="Início" />
          <NavItem path="/library" icon={Dumbbell} label="Treinos" />
          
          <button 
            onClick={() => navigate('/')} 
            className="mb-8 bg-ains-primary border-4 border-black rounded-xl p-3 shadow-[0_0_20px_rgba(255,215,0,0.4)] text-black transform hover:scale-105 transition-transform hover:rotate-3"
          >
            <Play size={28} fill="currentColor" />
          </button>

          <NavItem path="/coach" icon={MessageSquare} label="Coach" />
          <NavItem path="/profile" icon={User} label="Perfil" />
        </div>
      )}
    </div>
  );
};