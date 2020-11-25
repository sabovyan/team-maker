import React, { useState } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

function ForthStep() {
  const classes = useStyles();
  const [score, setScore] = useState('100');

  const handleScoreValue = ({ target: { value } }) => {
    setScore(value);
  };

  return (
    <div>
      <Typography
        color="textSecondary"
        variant="h4"
        component="h2"
        style={{
          margin: '1rem 0',
        }}
      >
        Set max Score for game
      </Typography>
      <TextField
        type="number"
        variant="outlined"
        value={score}
        onChange={handleScoreValue}
        fullWidth
        className={classes.textField}
      />
    </div>
  );
}

export default ForthStep;
