import React, { useState } from 'react';
import generateNewId from '../../utils/generateNewId';
import Form from '../Form/Form';
import Screen from '../Screen/Screen';
import { Button, makeStyles, TextField } from '@material-ui/core';

/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { addPlayer } from '../../store/features/players.feature';
import { getNextStep } from '../../store/features/stepCounter.feature';
import { setError } from '../../store/features/Error.feature';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const newId = generateNewId();

function FirstStep() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players);

  const [player, setPlayer] = useState('');

  const handlePlayerInput = ({ target: { value } }) => {
    setPlayer(value);
  };

  const handlePlayerFormSubmit = (e) => {
    e.preventDefault();
    const newPlayer = {
      name: player,
      id: newId(),
      isEdit: false,
      draft: '',
    };

    dispatch(addPlayer(newPlayer));
    setPlayer('');
  };

  const handleNext = () => {
    try {
      if (!players.length) {
        throw new Error('🐵 please add some players');
      }

      dispatch(getNextStep());
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <>
      <Form onSubmit={handlePlayerFormSubmit}>
        <TextField
          onChange={handlePlayerInput}
          label="player's name"
          variant="outlined"
          value={player}
        />
      </Form>
      <Screen />
      <div className={classes.actionsContainer}>
        <div>
          <Button disabled className={classes.button}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default FirstStep;
