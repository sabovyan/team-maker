import React from 'react';
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import COLORS from '../../constants/colors.constants';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

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

function TeamMate({ players, index }) {
  const getRandomNumber = (nickNames) => {
    let random = Math.floor(Math.random() * nickNames.length);

    return random;
  };

  return players.map((player) => (
    <ListItem key={player.id}>
      <ListItemAvatar>
        <Avatar>
          <SportsEsportsIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={player.name}
        secondary={nicknames[getRandomNumber(nicknames)]}
        style={{
          color: COLORS[index],
          fontWeight: 'bolder',
        }}
      />
      <Divider />
    </ListItem>
  ));
}

export default TeamMate;
