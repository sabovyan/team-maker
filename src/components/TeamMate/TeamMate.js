import React from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

const nicknames = [
  'Butterbean',
  'Big Baby',
  'The Nigerian Nightmare',
  'The Hawk',
  'Spud',
  'Megatron',
  'The Grim Reaper',
  'The Chief',
  'The Snake',
  'Smokin',
  'The Assassin',
  'AK-47',
  'Darth',
  'Shogun',
  'Ironhead',
  'Mr. October',
  'Marvelous',
  'Refrigerator',
  'The Golden Boy',
  'The Bird',
  'Tractor',
  'Cool Papa',
];

function TeamMate({ players }) {
  const getRandomNumber = (nickNames) => {
    let random = Math.floor(Math.random() * nickNames.length);

    return random;
  };

  return players.map((player) => (
    <ListItem key={player.id}>
      <ListItemAvatar>
        <Avatar>{/* <ImageIcon /> */}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={player.name}
        secondary={nicknames[getRandomNumber(nicknames)]}
      />
    </ListItem>
  ));
}

export default TeamMate;
