import React, { useState } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setMaxScore } from '../../store/features/teams.feature';

import useStyles from '../../styles/textField.style';

function ForthStep() {
  const classes = useStyles('#FB8B24')();
  const [score, setScore] = useState('100');
  const dispatch = useDispatch();

  const handleScoreValue = ({ target: { value } }) => {
    dispatch(setMaxScore(value));
    setScore(value);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Typography
          color="textSecondary"
          variant="h5"
          component="span"
          style={{
            boxShadow: '5px 5px 5px #94949469, -5px -5px 5px #94949423',
            padding: 13,
            borderRadius: 7,
          }}
          align="center"
        >
          Set max Score for game
        </Typography>

        <TextField
          type="number"
          variant="outlined"
          value={score}
          onChange={handleScoreValue}
          className={classes.textField}
          fullWidth
          style={{
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}

export default ForthStep;
