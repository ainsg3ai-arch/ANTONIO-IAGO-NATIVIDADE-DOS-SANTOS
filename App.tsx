import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { WorkoutPlayer } from './pages/WorkoutPlayer';
import { WorkoutBuilder } from './pages/WorkoutBuilder'; 
import { Library } from './pages/Library';
import { Stats } from './pages/Stats';
import { Profile } from './pages/Profile';
import { Coach } from './pages/Coach';
import { Tools } from './pages/Tools';
import { Nutrition } from './pages/Nutrition';
import { Store } from './pages/Store';
import { Campaign } from './pages/Campaign';
import { Battle } from './pages/Battle';
import { getProfile } from './services/storageService';

const RequireProfile: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const profile = getProfile();
  
  if (!profile || !profile.onboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/" element={<RequireProfile><Dashboard /></RequireProfile>} />
          <Route path="/workout-active" element={<RequireProfile><WorkoutPlayer /></RequireProfile>} />
          <Route path="/builder" element={<RequireProfile><WorkoutBuilder /></RequireProfile>} />
          <Route path="/library" element={<RequireProfile><Library /></RequireProfile>} />
          <Route path="/stats" element={<RequireProfile><Stats /></RequireProfile>} />
          <Route path="/profile" element={<RequireProfile><Profile /></RequireProfile>} />
          <Route path="/coach" element={<RequireProfile><Coach /></RequireProfile>} />
          <Route path="/tools" element={<RequireProfile><Tools /></RequireProfile>} />
          <Route path="/nutrition" element={<RequireProfile><Nutrition /></RequireProfile>} />
          <Route path="/store" element={<RequireProfile><Store /></RequireProfile>} />
          <Route path="/campaign" element={<RequireProfile><Campaign /></RequireProfile>} />
          <Route path="/battle" element={<RequireProfile><Battle /></RequireProfile>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;