import { createSlice } from '@reduxjs/toolkit';

// const shuffledPlayers = (players) => {
//   const input = [...players];
//   const output = input.sort(() => Math.random() - 0.5);
//   return output;
// };

const { actions, reducer } = createSlice({
  name: 'players',
  initialState: [],
  reducers: {
    addPlayer: (state, { payload }) => [...state, payload],

    removePlayer: (state, { payload }) =>
      state.filter((player) => player.id !== payload),

    setEditStatus: (state, { payload }) =>
      state.map((player) =>
        player.id === payload
          ? { ...player, isEdit: !player.isEdit, draft: player.name }
          : player
      ),

    setPlayerFormSubmit: (state, { payload }) => {
      return state.map((player) => {
        if (player.id === payload) {
          if (player.draft.trim() === '') {
            return { ...player, isEdit: !player.isEdit };
          } else {
            return { ...player, name: player.draft, isEdit: !player.isEdit };
          }
        } else {
          return player;
        }
      });
    },

    SetDraftValueChange: (state, { payload }) =>
      state.map((player) =>
        player.id === payload.id ? { ...player, draft: payload.value } : player
      ),

    shufflePLayers: (state) => {
      state = state.sort(() => Math.random() - 0.5);
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
