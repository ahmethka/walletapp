import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

export const useTheme = create<ThemeState>((set, get) => ({
  mode: 'light', // varsayılan
  setMode: (m) => set({ mode: m }),
  toggle: () => set({ mode: get().mode === 'light' ? 'dark' : 'light' }),
}));
