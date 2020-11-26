import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const useStyles = (color) =>
  makeStyles({
    root: {
      alignSelf: 'center',
      padding: '1rem',
      background: color,
      color: 'white',
      maxWidth: 100,
      width: 100,
      marginTop: 16,
      marginBottom: 8,

      '&:hover': {
        background: color,
        boxShadow: '7px 7px 7px 3px #94949469, -7px -7px 7px #94949423',
      },
      '&:active': {
        boxShadow: '1px 1px 1px 3px #94949469, -1px -1px 1px #94949423',
      },
    },
  });

function ResetButton({ color, ...props }) {
  const classes = useStyles(color)();
  return (
    <Button variant="outlined" {...props} className={classes.root}>
      Reset
    </Button>
  );
}

export default ResetButton;
