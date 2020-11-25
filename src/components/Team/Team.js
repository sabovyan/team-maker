import React, { useState } from 'react';
import {
  Box,
  Divider,
  LinearProgress,
  List,
  Typography,
  makeStyles,
} from '@material-ui/core';
import styles from './Team.module.css';

import TeamMate from '../TeamMate/TeamMate';

const useStyles = (color) =>
  makeStyles({
    root: {
      background: `${color}40`,
      height: 20,

      '& .MuiLinearProgress-barColorPrimary': {
        background: color,
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

function Team({ team, color, index, maxScore }) {
  const [score, setScore] = useState(45);
  return (
    <div className={styles.team}>
      <Typography
        variant="h2"
        component="h3"
        style={{
          textTransform: 'uppercase',
          color,
        }}
      >
        {team.name}
      </Typography>
      <Divider />
      <List>
        <TeamMate index={index} players={team.players} />
      </List>
      <Divider />
      <Typography
        variant="h4"
        component="h5"
        align="center"
        style={{
          textTransform: 'uppercase',
          color,
        }}
      >
        Score
      </Typography>
      <Typography
        variant="h4"
        component="h5"
        align="center"
        style={{
          textTransform: 'uppercase',
          color,
        }}
      >
        {score}
      </Typography>
      <LinearProgressWithLabel value={(score * maxScore) / 100} color={color} />
    </div>
  );
}

export default Team;
