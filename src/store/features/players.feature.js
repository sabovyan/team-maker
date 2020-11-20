import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'players',
  initialState: [
    {
      name: 'Van Gogh',
      isEdit: false,
      draft: '',
      id: 'aa1',
    },
    {
      name: 'Beethoven',
      isEdit: false,
      draft: '',
      id: 'aa2',
    },
    {
      name: 'Bach',
      isEdit: false,
      draft: '',
      id: 'aa3',
    },
    {
      name: 'Mozart',
      isEdit: false,
      draft: '',
      id: 'aa4',
    },
  ],
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
  },
});
export const {
  addPlayer,
  removePlayer,
  setEditStatus,
  setPlayerFormSubmit,
  SetDraftValueChange,
} = actions;
export default reducer;
