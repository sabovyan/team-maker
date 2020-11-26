import React, { useState } from 'react';
import { Divider, List, Typography } from '@material-ui/core';
import styles from './Team.module.css';

import TeamMate from '../TeamMate/TeamMate';
import ScoreTracker from '../ScoreTracker/ScoreTracker';

function Team({ team, color, index, maxScore }) {
  return (
    <div className={styles.team}>
      <Typography
        variant="h2"
        component="h3"
        style={{
          textTransform: 'uppercase',
          color,
          backgroundColor: '#eeeeee',
          padding: 10,
        }}
      >
        {team.name}
      </Typography>
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
