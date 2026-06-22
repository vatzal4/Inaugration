import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useKeyboardOperator } from './hooks/useKeyboardOperator';

// Screen Components
import { GreetingScreen } from './components/GreetingScreen';
import { TreeIntroScreen } from './components/TreeIntroScreen';
import { InteractiveTreeScreen } from './components/InteractiveTreeScreen';
import { ProjectVideoScreen } from './components/ProjectVideoScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { OperatorPanel } from './components/OperatorPanel';

// Sync component to coordinate Zustand state transitions with React Router URLs
const RouteSync: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screen = useStore((state) => state.screen);
  const activeLeafId = useStore((state) => state.activeLeafId);

  useEffect(() => {
    let targetPath = '/';
    if (screen === 'intro') targetPath = '/intro';
    else if (screen === 'tree') targetPath = '/tree';
    else if (screen === 'project' && activeLeafId !== null) targetPath = `/project/${activeLeafId}`;
    else if (screen === 'complete') targetPath = '/complete';

    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [screen, activeLeafId, navigate, location.pathname]);

  return null;
};

const AppContent: React.FC = () => {
  // Bind global keyboard operator commands (SPACE, R, V, ESC)
  useKeyboardOperator();

  return (
    <div className="w-full h-full relative overflow-hidden bg-bg-dark text-text-white font-body">
      <RouteSync />
      
      {/* Route Views */}
      <Routes>
        <Route path="/" element={<GreetingScreen />} />
        <Route path="/intro" element={<TreeIntroScreen />} />
        <Route path="/tree" element={<InteractiveTreeScreen />} />
        <Route path="/project/:id" element={<ProjectVideoScreen />} />
        <Route path="/complete" element={<CompletionScreen />} />
      </Routes>

      {/* Hidden operator panel, toggleable with key 'O' or bottom-left zone */}
      <OperatorPanel />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
