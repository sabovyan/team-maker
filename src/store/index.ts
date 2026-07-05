import { create } from 'zustand';

import type { Player, TeamsState } from '../types';
import { initialTeamsState } from './features/teams.feature';

export type AppState = {
  players: Player[];
  teams: TeamsState;
};

export type AppAction = (state: AppState) => AppState | Partial<AppState>;

export const useAppStore = create<AppState>(() => ({
  players: [],
  teams: initialTeamsState,
}));
