import React from 'react';

import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = (color) =>
  makeStyles({
    root: {
      background: `${color}40`,
      height: 20,

      '& .MuiLinearProgress-barColorPrimary': {
        background: `linear-gradient(to right, ${color}, ${color}40, ${color} )`,
      },
    },
  });

function LinearProgressWithLabel({ color, ...props }) {
  const classes = useStyles(color)();
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          {...props}
          className={classes.root}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default LinearProgressWithLabel;
