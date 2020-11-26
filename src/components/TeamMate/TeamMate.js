import React from 'react';
import { Avatar, Divider, ListItem, ListItemAvatar } from '@material-ui/core';

import SportsESportsIcon from '@material-ui/icons/SportsEsports';
import NameAndNickname from '../NameAndNickname/NameAndNickname';

function TeamMate({ players, index }) {
  return players && players.length
    ? players.map((player) => (
        <ListItem key={player.id}>
          <ListItemAvatar>
            <Avatar>
              <SportsESportsIcon />
            </Avatar>
          </ListItemAvatar>
          <NameAndNickname index={index} primary={player.name} />
          <Divider />
        </ListItem>
      ))
    : null;
}

export default TeamMate;
