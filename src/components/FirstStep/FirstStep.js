import React, { useState } from 'react';
import generateNewId from '../../utils/generateNewId';
import Form from '../Form/Form';
import Screen from '../Screen/Screen';
import { makeStyles, TextField } from '@material-ui/core';

/* redux */
import { useDispatch } from 'react-redux';
import { addPlayer } from '../../store/features/players.feature';

const useStyles = makeStyles((theme) => ({
  textField: {
    '& .MuiInputBase-input': {
      border: 'none',
      borderRadius: 4,
      transition: 'box-shadow 0.1s ease-in-out',
      boxShadow: '0.1px 0.1px 1px #9494948f, -0.1px -0.1px 1px #9494948f',
    },
    '& .MuiInputBase-input:focus': {
      border: 'none',
      boxShadow: '7px 7px 7px #94949469, -7px -7px 7px #94949423',
    },
    '& .MuiInputBase-input:hover': {
      border: 'none',
      boxShadow: '7px 7px 7px #94949469, -7px -7px 7px #94949423',
    },

    '& .MuiOutlinedInput-root': {
      border: 'none',
    },

    '& .MuiInputBase-root:hover': {
      border: 'none',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },

    '& .PrivateNotchedOutline-legendNotched-7': {
      background: 'white',
      color: '#0f4c5c',
    },
  },
}));

const newId = generateNewId();

function FirstStep() {
  const dispatch = useDispatch();
  const classes = useStyles();

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
      <Form
        onSubmit={handlePlayerFormSubmit}
        style={{
          alignSelf: 'flex-start',
          width: '100%',
        }}
      >
        <TextField
          onChange={handlePlayerInput}
          label="player's name"
          variant="outlined"
          value={player}
          fullWidth
          className={classes.textField}
          style={{}}
        />
      </Form>
      <Screen />
    </>
  );
}

export default FirstStep;
