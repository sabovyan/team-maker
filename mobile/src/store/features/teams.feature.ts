import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Player, Team, TeamsState } from '../../types';
import generateNewId from '../../utils/generateNewId';

function splitArrayIntoChunksOfLen(players: Player[], numberOfTeams: number): Player[][] {
  const chunks: Player[][] = [];
  const numberOfTotalPlayers = players.length;
  const numberOfTeamMates = numberOfTotalPlayers / numberOfTeams;
  let i = 0;

  while (i < numberOfTotalPlayers) {
    chunks.push(players.slice(i, (i += numberOfTeamMates)));
  }

  return chunks;
}

function createTeam(id: string, name: string): Team {
  return {
    id,
    name,
    isEdit: false,
    draft: '',
    players: [],
  };
}

function createTeams(numberOfGroups: number, createId: () => string): Team[] {
  const teams: Team[] = [];

  for (let i = 0; i < numberOfGroups; i += 1) {
    teams.push(createTeam(createId(), `team${i + 1}`));
  }

  return teams;
}

const newId = generateNewId();

const initialState: TeamsState = {
  numberOfGroups: 2,
  maxScore: 100,
  teams: [createTeam('bb1', 'team1'), createTeam('bb2', 'team2')],
};

const { reducer, actions } = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    increaseNumberOfGroupsByOne: (state) => {
      if (state.numberOfGroups < 6) {
        state.numberOfGroups += 1;
        state.teams = createTeams(state.numberOfGroups, newId);
      }
    },

    decreaseNumberOfGroupsByOne: (state) => {
      if (state.numberOfGroups > 2) {
        state.numberOfGroups -= 1;
        state.teams = createTeams(state.numberOfGroups, newId);
      }
    },

    addNumberOfGroups: (state, { payload }: PayloadAction<number>) => {
      state.numberOfGroups = payload;
      state.teams = createTeams(state.numberOfGroups, newId);
    },

    setMaxScore: (state, { payload }: PayloadAction<TeamsState['maxScore']>) => {
      state.maxScore = payload;
    },

    setTeamEditStatus: (state, { payload }: PayloadAction<Team['id']>) => {
      const teams = state.teams.map((team) =>
        team.id === payload ? { ...team, isEdit: !team.isEdit, draft: team.name } : team
      );

      return {
        ...state,
        teams,
      };
    },

    SetTeamDraftValueChange: (
      state,
      { payload }: PayloadAction<{ id: Team['id']; value: string }>
    ) => {
      const teams = state.teams.map((team) =>
        team.id === payload.id ? { ...team, draft: payload.value } : team
      );

      return {
        ...state,
        teams,
      };
    },

    setTeamFormSubmit: (state, { payload }: PayloadAction<Team['id']>) => {
      const teams = state.teams.map((team) => {
        if (team.id === payload) {
          if (team.draft.trim() === '') {
            return { ...team, isEdit: !team.isEdit };
          }

          return { ...team, name: team.draft, isEdit: !team.isEdit };
        }

        return team;
      });

      return {
        ...state,
        teams,
      };
    },

    getPlayersForTeams: (state, { payload }: PayloadAction<Player[]>) => {
      const players = [...payload];
      const chunks = splitArrayIntoChunksOfLen(players, state.numberOfGroups);
      state.teams = state.teams.map((team, index) => ({
        ...team,
        players: chunks[index] ?? [],
      }));
    },
  },
});

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

export default reducer;
