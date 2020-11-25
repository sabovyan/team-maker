import { createSlice } from '@reduxjs/toolkit';
import generateNewId from '../../utils/generateNewId';

function splitArrayIntoChunksOfLen(arr, len) {
  var chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
}

const newId = generateNewId();

const { reducer, actions } = createSlice({
  name: 'teams',
  initialState: {
    numberOfGroups: 2,
    teams: [
      {
        id: 'bb1',
        name: 'team1',
        isEdit: false,
        draft: '',
      },
      {
        name: 'team2',
        isEdit: false,
        id: 'bb2',
        draft: '',
      },
    ],
  },
  reducers: {
    increaseNumberOfGroupsByOne: (state) => {
      if (state.numberOfGroups < 6) {
        state.numberOfGroups += 1;
        state.teams = [];

        for (let i = 0; i < state.numberOfGroups; i++) {
          const name = `team${i + 1}`;
          state.teams.push({
            id: newId(),
            name,
            isEdit: false,
          });
        }
      }
    },
    decreaseNumberOfGroupsByOne: (state) => {
      if (state.numberOfGroups > 2) {
        state.numberOfGroups -= 1;
        state.teams = [];

        for (let i = 0; i < state.numberOfGroups; i++) {
          const name = `team${i + 1}`;
          state.teams.push({
            id: newId(),
            name,
            isEdit: false,
          });
        }
      }
    },

    addNumberOfGroups: (state, { payload }) => {
      state.teams = [];
      state.numberOfGroups = payload;
      for (let i = 0; i < state.numberOfGroups; i++) {
        const name = `team${i + 1}`;
        state.teams.push({
          id: newId(),
          name,
          isEdit: false,
        });
      }
    },

    setTeamEditStatus: (state, { payload }) => {
      const teams = state.teams.map((team) =>
        team.id === payload
          ? { ...team, isEdit: !team.isEdit, draft: team.name }
          : team
      );
      return {
        ...state,
        teams,
      };
    },

    SetTeamDraftValueChange: (state, { payload }) => {
      const teams = state.teams.map((team) =>
        team.id === payload.id ? { ...team, draft: payload.value } : team
      );
      return {
        ...state,
        teams,
      };
    },

    setTeamFormSubmit: (state, { payload }) => {
      const teams = state.teams.map((team) => {
        if (team.id === payload) {
          if (team.draft.trim() === '') {
            return { ...team, isEdit: !team.isEdit };
          } else {
            return { ...team, name: team.draft, isEdit: !team.isEdit };
          }
        } else {
          return team;
        }
      });

      return {
        ...state,
        teams,
      };
    },

    getPlayersForTeams: (state, { payload }) => {
      const players = [...payload];
      const chunks = splitArrayIntoChunksOfLen(players, state.numberOfGroups);
      state.teams.map((team, index) => {
        team.players = chunks[index];
      });
    },
  },
});

export default reducer;
export const {
  addNumberOfGroups,
  setTeamEditStatus,
  SetTeamDraftValueChange,
  setTeamFormSubmit,
  increaseNumberOfGroupsByOne,
  decreaseNumberOfGroupsByOne,
  getPlayersForTeams,
} = actions;
