import { makeStyles, TextField } from '@material-ui/core';
import React from 'react';
import Form from '../Form/Form';
import { useDispatch } from 'react-redux';
import {
  setPlayerFormSubmit,
  SetDraftValueChange,
} from '../../store/features/players.feature';

const useStyles = makeStyles({
  root: {
    margin: 0,
    '& .MuiInputBase-input': {
      padding: 10,
      borderRadius: 5,
    },
  },
});

function PlayerForm({ player: { id, isEdit, draft } }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const handlePlayerInputEdit = (id) => (e) => {
    e.target.focus();
    const { value } = e.target;
    dispatch(SetDraftValueChange({ id, value }));
  };

  const handlePlayerInputSubmit = (id) => (e) => {
    e.preventDefault();
    dispatch(setPlayerFormSubmit(id));
  };
  return (
    <div>
      <li>
        <Form onSubmit={handlePlayerInputSubmit(id)}>
          <TextField
            variant="outlined"
            autoFocus={isEdit ? true : false}
            type={'text'}
            value={draft}
            onChange={handlePlayerInputEdit(id)}
            onBlur={handlePlayerInputSubmit(id)}
            className={classes.root}
          />
        </Form>
      </li>
    </div>
  );
}

export default PlayerForm;
