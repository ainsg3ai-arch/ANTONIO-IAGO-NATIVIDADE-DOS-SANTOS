import React from 'react';
import { Home, User, Play, ShoppingBag, Map, Swords } from 'lucide-react';
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
        className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-all duration-300 relative group ${isActive ? 'text-ains-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:-translate-y-0.5'}`}>
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        {isActive && (
            <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-ains-primary shadow-[0_0_10px_#00AFFF]"></span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-ains-bg text-ains-text overflow-hidden font-sans selection:bg-ains-primary selection:text-black">
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar relative z-0">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-ains-primary/5 to-transparent pointer-events-none z-[-1]"></div>
        {children}
      </main>

      {!hideNav && (
        <div className="fixed bottom-6 left-6 right-6 h-16 glass-panel rounded-2xl flex items-center justify-between px-2 shadow-2xl z-50">
          <NavItem path="/" icon={Home} label="Início" />
          <NavItem path="/campaign" icon={Map} label="Saga" />
          
          {/* Central Play Button */}
          <div className="relative -top-6">
              <button 
                onClick={() => navigate('/')} 
                className="bg-ains-primary rounded-full p-4 shadow-neon text-black transform hover:scale-105 transition-transform active:scale-95 border-4 border-ains-bg"
              >
                <Play size={28} fill="currentColor" className="ml-1" />
              </button>
          </div>

          <NavItem path="/battle" icon={Swords} label="PvP" />
          <NavItem path="/store" icon={ShoppingBag} label="Loja" />
        </div>
      )}
    </div>
  );
};