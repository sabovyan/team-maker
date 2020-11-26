import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = (color) =>
  makeStyles({
    textField: {
      '& .MuiInputBase-input': {
        border: 'none',
        borderRadius: 4,
        maxWidth: 100,
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

      '& .MuiFormLabel-root': {
        color,
        background: 'white',
      },
    },
  });

function PointBox({ color, onChange, value, label }) {
  const classes = useStyles(color)();
  return (
    <>
      <TextField
        className={classes.textField}
        margin="normal"
        label={label}
        variant="outlined"
        onChange={onChange}
        value={value}
        type="number"
      />
    </>
  );
}

export default PointBox;
