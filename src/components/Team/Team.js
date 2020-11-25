import React, { useEffect, useState } from 'react';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import COLORS from '../../constants/colors.constants';
import TeamMate from '../TeamMate/TeamMate';

function Team({ label, team }) {
  const [selectedColor, setSelectedColor] = useState('blue');

  const getRandomColor = (colors) => {
    const random = Math.floor(Math.random() * colors.length);
    setSelectedColor(colors[random]);
  };

  useEffect(() => {
    getRandomColor(COLORS);
  }, []);
  return (
    <div
      style={{
        background: 'lightblue',
        padding: 10,
      }}
    >
      <Typography
        variant="h2"
        component="h3"
        style={{
          textTransform: 'uppercase',
          color: selectedColor,
        }}
      >
        {team.name}
      </Typography>
      <List>
        <TeamMate players={team.players} />
      </List>
    </div>
  );
}

export default Team;
