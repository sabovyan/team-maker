import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Player } from '../../types';

const initialState: Player[] = [];

const { actions, reducer } = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer: (state, { payload }: PayloadAction<Player>) => [...state, payload],

    removePlayer: (state, { payload }: PayloadAction<Player['id']>) =>
      state.filter((player) => player.id !== payload),

    setEditStatus: (state, { payload }: PayloadAction<Player['id']>) =>
      state.map((player) =>
        player.id === payload
          ? { ...player, isEdit: !player.isEdit, draft: player.name }
          : player
      ),

    setPlayerFormSubmit: (state, { payload }: PayloadAction<Player['id']>) => {
      return state.map((player) => {
        if (player.id === payload) {
          if (player.draft.trim() === '') {
            return { ...player, isEdit: !player.isEdit };
          }

          return { ...player, name: player.draft, isEdit: !player.isEdit };
        }

        return player;
      });
    },

    SetDraftValueChange: (
      state,
      { payload }: PayloadAction<{ id: Player['id']; value: string }>
    ) =>
      state.map((player) =>
        player.id === payload.id ? { ...player, draft: payload.value } : player
      ),

    shufflePLayers: (state) => {
      state.sort(() => Math.random() - 0.5);
    },
  },
});

export const {
  addPlayer,
  removePlayer,
  setEditStatus,
  setPlayerFormSubmit,
  SetDraftValueChange,
  shufflePLayers,
} = actions;

export default reducer;
