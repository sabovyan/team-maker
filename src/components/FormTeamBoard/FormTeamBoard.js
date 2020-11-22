import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTeamEditStatus,
  SetTeamDraftValueChange,
  setTeamFormSubmit,
} from '../../store/features/teams.feature';
import COLORS from '../../constants/colors.constants';
/* components */
import PlayerForm from '../PlayerForm/PlayerForm';
import Form from '../Form/Form';
/* UI */
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

const useStyles = makeStyles({
  root: {
    margin: '5px 0',
    height: 46,
    padding: 5,
    '& .MuiInputBase-input': {
      padding: 10,
      borderRadius: 5,
    },
  },

  chip: {
    height: 46,
    padding: 5,
    margin: '5px 0',
    fontSize: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '2fr 10fr',
    justifyItems: 'start',
  },
});

function FormTeamBoard() {
  const { teams } = useSelector((state) => state.teams);
  const [selectedColor, setSelectedColor] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();

  const getRandomColor = (colors) => {
    const random = Math.floor(Math.random() * colors.length);
    setSelectedColor(colors[random]);
  };

  useEffect(() => {
    getRandomColor(COLORS);
  }, []);

  const handleTeamInputSubmit = (id) => () => {
    dispatch(setTeamFormSubmit(id));
  };
  const handleTeamInputEdit = (id) => ({ target: { value } }) => {
    dispatch(SetTeamDraftValueChange({ id, value }));
  };

  const handleEditStatus = (id) => () => {
    dispatch(setTeamEditStatus(id));
  };
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: '10px 0',
      }}
    >
      {teams &&
        teams.map(({ isEdit, id, name, draft }) =>
          isEdit ? (
            <Form
              key={id}
              onSubmit={handleTeamInputSubmit(id)}
              style={{ width: '100%' }}
            >
              <TextField
                variant="outlined"
                autoFocus={isEdit ? true : false}
                type={'text'}
                value={draft}
                onChange={handleTeamInputEdit(id)}
                onBlur={handleTeamInputSubmit(id)}
                className={classes.root}
                fullWidth
              />
            </Form>
          ) : (
            <Chip
              key={id}
              size="medium"
              icon={<EmojiPeopleIcon />}
              label={name}
              onClick={handleEditStatus(id)}
              color="primary"
              className={classes.chip}
              style={{
                backgroundColor: selectedColor,
              }}
            />
          )
        )}
    </div>
  );
}

export default FormTeamBoard;
