import { createSlice } from '@reduxjs/toolkit';
import generateNewId from '../../utils/generateNewId';

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
    addNumberOfGroups: (state, { payload }) => {
      const teams = [];
      if (!state.teams.length) {
        for (let i = 0; i < payload; i++) {
          const name = `team${i + 1}`;
          teams.push({
            id: newId(),
            name,
            isEdit: false,
          });
        }
      }

      return {
        numberOfGroups: payload,
        teams,
      };
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
  },
});

export default reducer;
export const {
  addNumberOfGroups,
  setTeamEditStatus,
  SetTeamDraftValueChange,
  setTeamFormSubmit,
} = actions;
