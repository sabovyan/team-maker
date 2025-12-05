import React from 'react';
import { Divider, List, Typography } from '@material-ui/core';
import styles from './Team.module.css';

import TeamMate from '../TeamMate/TeamMate';
import ScoreTracker from '../ScoreTracker/ScoreTracker';

function Team({ team, color, index, maxScore }) {
  return (
    <div className={styles.team}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          textTransform: 'uppercase',
          color,
          backgroundColor: '#eeeeee',
          padding: 10,
        }}
      >
        <Typography variant="h3" component="h3" style={{}}>
          {team.name}
        </Typography>
      </div>
      <Divider />
      <List>
        <TeamMate index={index} players={team.players} />
      </List>
      <Divider />
      <ScoreTracker color={color} maxScore={maxScore} />
    </div>
  );
}

export default Team;
