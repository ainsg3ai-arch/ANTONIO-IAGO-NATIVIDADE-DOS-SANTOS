import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { WorkoutPlayer } from './pages/WorkoutPlayer';
import { Library } from './pages/Library';
import { Stats } from './pages/Stats';
import { Profile } from './pages/Profile';
import { getProfile } from './services/storageService';

// Componente de Guarda de Rota
// Verifica se o usuário existe. Se sim, renderiza a página. Se não, manda pro cadastro.
const RequireProfile = ({ children }: { children: React.ReactNode }) => {
  const profile = getProfile();
  
  if (!profile || !profile.onboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Rota de Cadastro/Edição é pública, mas tem lógica interna para redirecionar se já logado */}
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Rotas Protegidas (Só acessa se tiver cadastro) */}
          <Route path="/" element={
            <RequireProfile>
              <Dashboard />
            </RequireProfile>
          } />
          
          <Route path="/workout-active" element={
            <RequireProfile>
              <WorkoutPlayer />
            </RequireProfile>
          } />
          
          <Route path="/library" element={
            <RequireProfile>
              <Library />
            </RequireProfile>
          } />
          
          <Route path="/stats" element={
            <RequireProfile>
              <Stats />
            </RequireProfile>
          } />
          
          <Route path="/profile" element={
            <RequireProfile>
              <Profile />
            </RequireProfile>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;