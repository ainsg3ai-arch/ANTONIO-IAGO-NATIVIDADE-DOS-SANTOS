import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { WorkoutPlayer } from './pages/WorkoutPlayer';
import { Library } from './pages/Library';
import { Stats } from './pages/Stats';
import { Profile } from './pages/Profile';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout-active" element={<WorkoutPlayer />} />
          <Route path="/library" element={<Library />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;