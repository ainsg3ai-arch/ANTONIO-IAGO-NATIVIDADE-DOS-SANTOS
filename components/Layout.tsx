import React from 'react';
import { Home, Dumbbell, BarChart2, User, PlayCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on workout player or onboarding
  const hideNav = location.pathname === '/workout-active' || location.pathname === '/onboarding';

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${isActive ? 'text-ains-primary' : 'text-ains-muted'}`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-ains-black text-ains-text overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-ains-black/90 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around z-50 px-2 pb-2">
          <NavItem path="/" icon={Home} label="Início" />
          <NavItem path="/library" icon={Dumbbell} label="Biblioteca" />
          
          <button 
            onClick={() => navigate('/')} 
            className="mb-8 bg-ains-primary rounded-full p-4 shadow-xl shadow-lime-500/20 text-ains-black transform hover:scale-105 transition-transform"
          >
            <PlayCircle size={32} fill="currentColor" className="text-ains-black" />
          </button>

          <NavItem path="/stats" icon={BarChart2} label="Progresso" />
          <NavItem path="/profile" icon={User} label="Perfil" />
        </nav>
      )}
    </div>
  );
};