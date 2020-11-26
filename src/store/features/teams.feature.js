import { createSlice } from '@reduxjs/toolkit';
import generateNewId from '../../utils/generateNewId';

function splitArrayIntoChunksOfLen(arr, numberOfTeams) {
  const chunks = [];
  const NumberOfTotalPlayers = arr.length;
  const numberOfTeamMates = NumberOfTotalPlayers / numberOfTeams;
  let i = 0;

  while (i < NumberOfTotalPlayers) {
    chunks.push(arr.slice(i, (i += numberOfTeamMates)));
  }
  return chunks;
}

const newId = generateNewId();

const { reducer, actions } = createSlice({
  name: 'teams',
  initialState: {
    numberOfGroups: 2,
    maxScore: 100,
    teams: [
      {
        id: 'bb1',
        name: 'team1',
        isEdit: false,
        draft: '',
        players: [],
      },
      {
        name: 'team2',
        isEdit: false,
        id: 'bb2',
        draft: '',
        players: [],
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

    setMaxScore: (state, { payload }) => {
      state.maxScore = payload;
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
      state.teams = state.teams.map((team, index) => ({
        ...team,
        players: chunks[index],
      }));
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
  setMaxScore,
} = actions;
