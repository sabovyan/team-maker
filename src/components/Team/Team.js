import React from 'react';
import { Typography } from '@material-ui/core';

function Team({ label, team }) {
  return (
    <div
      style={{
        background: 'lightblue',
        padding: 10,
      }}
    >
      <Typography component="h2" variant="h4" align="center">
        {label}
      </Typography>
      <ul>
        {team.map((player, idx) => (
          <li key={player.name}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Team;
