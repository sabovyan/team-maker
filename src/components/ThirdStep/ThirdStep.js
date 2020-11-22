import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

/* redux */
import { useDispatch, useSelector } from 'react-redux';
import FormTeamBoard from '../FormTeamBoard/FormTeamBoard';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

function ThirdStep() {
  const { players, numberOfGroups } = useSelector((state) => state);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const shuffledPlayers = (players) => {
    const input = [...players];
    const output = input.sort(() => Math.random() - 0.5);
    return output;
  };

  const handleFinish = () => {
    const orderedPlayers = shuffledPlayers(players);
    // dispatch(setInitialState({ players: orderedPlayers, numberOfGroups }));
    history.push('/split');
  };
  return (
    <>
      <Typography
        variant="h5"
        component="h2"
        style={{
          margin: '0 10px',
        }}
      >
        Click and rename teams
      </Typography>
      <FormTeamBoard />
    </>
  );
}

export default ThirdStep;
