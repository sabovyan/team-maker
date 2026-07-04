import type { Player } from '../../types';
import type { AppAction } from '../index';

export const addPlayer = (payload: Player): AppAction => (state) => ({
  players: [...state.players, payload],
});

export const removePlayer = (payload: Player['id']): AppAction => (state) => ({
  players: state.players.filter((player) => player.id !== payload),
});

export const setEditStatus = (payload: Player['id']): AppAction => (state) => ({
  players: state.players.map((player) =>
    player.id === payload ? { ...player, isEdit: !player.isEdit, draft: player.name } : player
  ),
});

export const setPlayerFormSubmit = (payload: Player['id']): AppAction => (state) => ({
  players: state.players.map((player) => {
    if (player.id === payload) {
      if (player.draft.trim() === '') {
        return { ...player, isEdit: !player.isEdit };
      }

      return { ...player, name: player.draft, isEdit: !player.isEdit };
    }

    return player;
  }),
});

export const SetDraftValueChange = (payload: {
  id: Player['id'];
  value: string;
}): AppAction => (state) => ({
  players: state.players.map((player) =>
    player.id === payload.id ? { ...player, draft: payload.value } : player
  ),
});

export const shufflePLayers = (): AppAction => (state) => ({
  players: [...state.players].sort(() => Math.random() - 0.5),
});
