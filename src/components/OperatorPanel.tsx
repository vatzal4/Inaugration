import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings, Shield, RefreshCw, SkipForward, Maximize, Volume2, VolumeX } from 'lucide-react';

export const OperatorPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { 
    screen, 
    leaves, 
    activeLeafId, 
    isFullscreen, 
    isMuted,
    selectLeaf, 
    completeLeaf, 
    resetAll, 
    toggleFullscreen, 
    setIsMuted, 
    emergencySkip 
  } = useStore();

  // Toggle with 'O' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'o') {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    // Invisible click zone in bottom-left corner to open panel
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 left-0 w-6 h-6 z-50 cursor-crosshair opacity-0 hover:opacity-10 bg-gold/20 flex items-center justify-center text-[8px] text-gold"
        title="Admin Zone"
      >
        <Settings size={8} />
      </div>
    );
  }

  return (
    <div className="fixed top-6 left-6 z-50 max-w-md w-80 glass-panel-heavy rounded-2xl p-6 select-none font-body text-xs text-text-white/80 shadow-2xl border border-gold/30">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center space-x-2">
          <Shield size={14} className="text-gold" />
          <span className="font-heading text-sm font-bold text-text-white uppercase tracking-wider">
            Operator Controls
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-text-white/40 hover:text-text-white transition-colors uppercase tracking-wider text-[10px]"
        >
          [Hide]
        </button>
      </div>

      {/* Diagnostics / Screen State */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
          <span className="text-text-white/50">Active View:</span>
          <span className="font-bold text-gold uppercase tracking-wider bg-gold/15 px-2.5 py-0.5 rounded-full text-[10px] border border-gold/25">
            {screen}
          </span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
          <span className="text-text-white/50">Active Node ID:</span>
          <span className="font-bold text-text-white">
            {activeLeafId !== null ? `#${activeLeafId}` : 'None'}
          </span>
        </div>
      </div>

      {/* Primary Operator Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={resetAll}
          className="flex items-center justify-center space-x-1.5 p-2.5 bg-red-950/30 hover:bg-red-950/60 text-red-300 rounded-lg border border-red-500/20 transition-colors"
        >
          <RefreshCw size={12} />
          <span>Reset Platform</span>
        </button>
        <button
          onClick={emergencySkip}
          className="flex items-center justify-center space-x-1.5 p-2.5 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg border border-gold/25 transition-colors"
        >
          <SkipForward size={12} />
          <span>Emergency Skip</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center space-x-1.5 p-2.5 bg-white/5 hover:bg-white/10 text-text-white rounded-lg border border-white/10 transition-colors"
        >
          <Maximize size={12} />
          <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center justify-center space-x-1.5 p-2.5 bg-white/5 hover:bg-white/10 text-text-white rounded-lg border border-white/10 transition-colors"
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
        </button>
      </div>

      {/* Nodes Overview */}
      <div className="mb-4">
        <span className="text-text-white/50 block mb-2 uppercase tracking-widest text-[9px]">
          Inauguration Nodes
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {leaves.map((leaf) => (
            <button
              key={leaf.id}
              onClick={() => {
                if (leaf.state === 'completed') {
                  selectLeaf(leaf.id);
                } else if (leaf.state === 'playing') {
                  completeLeaf(leaf.id);
                } else {
                  selectLeaf(leaf.id);
                }
              }}
              className={`p-2 rounded-md border text-center transition-all duration-300 ${
                leaf.state === 'completed'
                  ? 'bg-gold/10 border-gold/40 text-gold'
                  : leaf.state === 'playing'
                  ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 animate-pulse'
                  : 'bg-white/5 border-white/10 text-text-white/60 hover:bg-white/10'
              }`}
              title={leaf.name}
            >
              <div className="font-bold">#{leaf.id}</div>
              <div className="text-[8px] truncate max-w-full uppercase">{leaf.state}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Shortcut Quick Guide */}
      <div className="border-t border-white/10 pt-3">
        <span className="text-text-white/40 block mb-1.5 uppercase tracking-widest text-[8px]">
          Operator Shortcuts
        </span>
        <div className="grid grid-cols-2 gap-y-1 text-[10px] text-text-white/50">
          <div><kbd className="bg-white/10 px-1 rounded text-text-white font-mono">SPACE</kbd> → Next / Skip</div>
          <div><kbd className="bg-white/10 px-1 rounded text-text-white font-mono">ESC</kbd> → Exit Video</div>
          <div><kbd className="bg-white/10 px-1 rounded text-text-white font-mono">R</kbd> → Reset All</div>
          <div><kbd className="bg-white/10 px-1 rounded text-text-white font-mono">V</kbd> → Replay Video</div>
        </div>
      </div>
    </div>
  );
};
export default OperatorPanel;
