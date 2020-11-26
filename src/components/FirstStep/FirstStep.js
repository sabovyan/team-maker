import React, { useState } from 'react';
import generateNewId from '../../utils/generateNewId';
import Form from '../Form/Form';
import Screen from '../Screen/Screen';
import { TextField } from '@material-ui/core';
import useStyles from '../../styles/textField.style';

/* redux */
import { useDispatch } from 'react-redux';
import { addPlayer } from '../../store/features/players.feature';

import './FirstStep.css';

const newId = generateNewId();

function FirstStep() {
  const dispatch = useDispatch();
  const classes = useStyles('#FB8B24')();

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

  return (
    <>
      <Form onSubmit={handlePlayerFormSubmit} className="form" style={{}}>
        <TextField
          onChange={handlePlayerInput}
          label="player's name"
          variant="outlined"
          value={player}
          fullWidth
          className={classes.textField}
        />
      </Form>
      <Screen />
    </>
  );
}

export default FirstStep;
