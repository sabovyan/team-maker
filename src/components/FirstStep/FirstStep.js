import React, { useState } from 'react';
import Form from '../Form/Form';
import Screen from '../Screen/Screen';
import { Button, makeStyles, TextField } from '@material-ui/core';

/* redux */
import { useDispatch } from 'react-redux';
import { addPlayer } from '../../store/features/players.feature';
import { getNextStep } from '../../store/features/stepCounter.feature';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

function generateNewId() {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
}

const newId = generateNewId();

function FirstStep() {
  const classes = useStyles();
  const [player, setPlayer] = useState('');
  const dispatch = useDispatch();

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
    dispatch(getNextStep());
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
