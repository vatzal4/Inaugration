import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useKeyboardOperator = () => {
  const { 
    screen, 
    activeLeafId, 
    leaves, 
    nextStep, 
    resetAll, 
    replayLeaf, 
    completeLeaf, 
    setScreen 
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      const code = event.code;

      // SPACE -> Next (Skip intro, complete video, or advance screen)
      if (code === 'Space') {
        event.preventDefault();
        nextStep();
      }

      // R -> Reset
      if (key === 'R') {
        resetAll();
      }

      // V -> Replay active video or replay the last completed leaf
      if (key === 'V') {
        if (screen === 'project' && activeLeafId !== null) {
          // Re-trigger the active leaf video replay
          replayLeaf(activeLeafId);
        } else if (screen === 'tree') {
          // Replay the last completed leaf if any
          const completedLeaves = leaves.filter(l => l.state === 'completed');
          if (completedLeaves.length > 0) {
            const lastCompleted = completedLeaves[completedLeaves.length - 1];
            replayLeaf(lastCompleted.id);
          }
        }
      }

      // ESC -> Exit project video playback
      if (event.key === 'Escape') {
        if (screen === 'project' && activeLeafId !== null) {
          event.preventDefault();
          completeLeaf(activeLeafId);
        } else if (screen === 'intro') {
          event.preventDefault();
          setScreen('tree');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [screen, activeLeafId, leaves, nextStep, resetAll, replayLeaf, completeLeaf, setScreen]);
};
