import type { Player, Team, TeamsState } from '../../types';
import generateNewId from '../../utils/generateNewId';
import type { AppAction } from '../index';

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

export const initialTeamsState: TeamsState = {
  numberOfGroups: 2,
  maxScore: 100,
  teams: [createTeam('bb1', 'team1'), createTeam('bb2', 'team2')],
};

export const increaseNumberOfGroupsByOne = (): AppAction => (state) => {
  if (state.teams.numberOfGroups >= 6) {
    return state;
  }

  const numberOfGroups = state.teams.numberOfGroups + 1;

  return {
    teams: {
      ...state.teams,
      numberOfGroups,
      teams: createTeams(numberOfGroups, newId),
    },
  };
};

export const decreaseNumberOfGroupsByOne = (): AppAction => (state) => {
  if (state.teams.numberOfGroups <= 2) {
    return state;
  }

  const numberOfGroups = state.teams.numberOfGroups - 1;

  return {
    teams: {
      ...state.teams,
      numberOfGroups,
      teams: createTeams(numberOfGroups, newId),
    },
  };
};

export const addNumberOfGroups = (payload: number): AppAction => (state) => ({
  teams: {
    ...state.teams,
    numberOfGroups: payload,
    teams: createTeams(payload, newId),
  },
});

export const setMaxScore = (payload: TeamsState['maxScore']): AppAction => (state) => ({
  teams: {
    ...state.teams,
    maxScore: payload,
  },
});

export const setTeamEditStatus = (payload: Team['id']): AppAction => (state) => ({
  teams: {
    ...state.teams,
    teams: state.teams.teams.map((team) =>
      team.id === payload ? { ...team, isEdit: !team.isEdit, draft: team.name } : team
    ),
  },
});

export const SetTeamDraftValueChange = (payload: {
  id: Team['id'];
  value: string;
}): AppAction => (state) => ({
  teams: {
    ...state.teams,
    teams: state.teams.teams.map((team) =>
      team.id === payload.id ? { ...team, draft: payload.value } : team
    ),
  },
});

export const setTeamFormSubmit = (payload: Team['id']): AppAction => (state) => ({
  teams: {
    ...state.teams,
    teams: state.teams.teams.map((team) => {
      if (team.id === payload) {
        if (team.draft.trim() === '') {
          return { ...team, isEdit: !team.isEdit };
        }

        return { ...team, name: team.draft, isEdit: !team.isEdit };
      }

      return team;
    }),
  },
});

export const getPlayersForTeams = (payload: Player[]): AppAction => (state) => {
  const players = [...payload];
  const chunks = splitArrayIntoChunksOfLen(players, state.teams.numberOfGroups);

  return {
    teams: {
      ...state.teams,
      teams: state.teams.teams.map((team, index) => ({
        ...team,
        players: chunks[index] ?? [],
      })),
    },
  };
};
