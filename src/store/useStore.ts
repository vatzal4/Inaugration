import { create } from 'zustand';

export type ScreenType = 'greeting' | 'intro' | 'tree' | 'project' | 'complete';
export type LeafState = 'pending' | 'playing' | 'completed' | 'replay';

export interface LeafNode {
  id: number;
  name: string;
  state: LeafState;
  videoSrc: string;
  x: number; // percentage of horizontal layout
  y: number; // percentage of vertical layout
}

interface AppState {
  screen: ScreenType;
  leaves: LeafNode[];
  activeLeafId: number | null;
  lastCompletedLeafId: number | null;
  isFullscreen: boolean;
  isMuted: boolean;
  
  // Actions
  setScreen: (screen: ScreenType) => void;
  selectLeaf: (id: number) => void;
  completeLeaf: (id: number) => void;
  replayLeaf: (id: number) => void;
  resetAll: () => void;
  toggleFullscreen: () => void;
  setIsMuted: (isMuted: boolean) => void;
  resetLastCompletedLeaf: () => void;

  
  // Admin & Skip controls
  emergencySkip: () => void;
  nextStep: () => void;
}

const initialLeaves: LeafNode[] = [
  { id: 1, name: 'Anvesha Building', state: 'pending', videoSrc: 'anvesha_building.mp4', x: 26, y: 55 },
  { id: 2, name: 'Boys Hostel', state: 'pending', videoSrc: 'boys_hostel.mp4', x: 18, y: 44 },
  { id: 3, name: 'Solar Rooftop', state: 'pending', videoSrc: 'solar_rooftop.mp4', x: 25, y: 32 },
  { id: 4, name: 'Data Science Lab', state: 'pending', videoSrc: 'data_science_lab.mp4', x: 38, y: 26 },
  { id: 5, name: 'Man Maintain', state: 'pending', videoSrc: 'man_maintain.mp4', x: 62, y: 26 },
  { id: 6, name: 'Pickleball Court', state: 'pending', videoSrc: 'pickleball_court.mp4', x: 75, y: 32 },
  { id: 7, name: 'Radio GSFCU', state: 'pending', videoSrc: 'radio_gsfcu.mp4', x: 82, y: 44 },
  { id: 8, name: '6S Application', state: 'pending', videoSrc: '6s_application.mp4', x: 74, y: 55 },
  { id: 9, name: 'Big Unity Application', state: 'pending', videoSrc: 'big_unity_application.mp4', x: 50, y: 20 },
];

export const useStore = create<AppState>((set, get) => ({
  screen: 'greeting',
  leaves: initialLeaves,
  activeLeafId: null,
  lastCompletedLeafId: null,
  isFullscreen: false,
  isMuted: false,

  setScreen: (screen) => set({ screen }),

  selectLeaf: (id) => {
    // Prevent double clicking or clicking other leaves when one is active
    const { screen, leaves } = get();
    if (screen !== 'tree') return;
    
    const leaf = leaves.find(l => l.id === id);
    if (!leaf) return;

    set({
      activeLeafId: id,
      screen: 'project',
      leaves: leaves.map(l => l.id === id ? { ...l, state: 'playing' } : l)
    });
  },

  completeLeaf: (id) => {
    const { leaves } = get();
    const updatedLeaves = leaves.map(l => 
      l.id === id ? { ...l, state: 'completed' as LeafState } : l
    );

    set({
      activeLeafId: null,
      lastCompletedLeafId: id,
      screen: 'tree',
      leaves: updatedLeaves
    });

    // Check if all leaves are completed
    const allCompleted = updatedLeaves.every(l => l.state === 'completed');
    if (allCompleted) {
      // Delay transitioning to completion screen for the visual satisfaction of leaf falling & pulse
      setTimeout(() => {
        set({ screen: 'complete' });
      }, 2500); // 2.5 seconds to allow leaf fall + pulse animation to play
    }
  },

  replayLeaf: (id) => {
    const { leaves } = get();
    const leaf = leaves.find(l => l.id === id);
    if (!leaf || leaf.state !== 'completed') return;

    set({
      activeLeafId: id,
      screen: 'project',
      leaves: leaves.map(l => l.id === id ? { ...l, state: 'playing' } : l)
    });
  },

  resetAll: () => {
    set({
      screen: 'greeting',
      leaves: initialLeaves.map(l => ({ ...l, state: 'pending' })),
      activeLeafId: null,
      lastCompletedLeafId: null
    });
  },

  resetLastCompletedLeaf: () => set({ lastCompletedLeafId: null }),

  toggleFullscreen: () => {
    const isFull = !get().isFullscreen;
    if (isFull) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
    set({ isFullscreen: isFull });
  },

  setIsMuted: (isMuted) => set({ isMuted }),

  emergencySkip: () => {
    const { screen, activeLeafId, completeLeaf } = get();
    if (screen === 'intro') {
      set({ screen: 'tree' });
    } else if (screen === 'project' && activeLeafId !== null) {
      completeLeaf(activeLeafId);
    } else if (screen === 'complete') {
      set({ screen: 'greeting' });
    }
  },

  nextStep: () => {
    const { screen, leaves, selectLeaf, activeLeafId, completeLeaf } = get();
    
    if (screen === 'greeting') {
      set({ screen: 'intro' });
    } else if (screen === 'intro') {
      set({ screen: 'tree' });
    } else if (screen === 'tree') {
      // Find the first pending leaf and activate it
      const nextPending = leaves.find(l => l.state === 'pending');
      if (nextPending) {
        selectLeaf(nextPending.id);
      } else {
        // If all are completed or no pending, check if all completed to trigger completion screen
        const allCompleted = leaves.every(l => l.state === 'completed');
        if (allCompleted) {
          set({ screen: 'complete' });
        }
      }
    } else if (screen === 'project' && activeLeafId !== null) {
      // Complete current active video
      completeLeaf(activeLeafId);
    } else if (screen === 'complete') {
      // Go back to start
      set({ screen: 'greeting' });
    }
  }
}));
