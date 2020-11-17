import React from 'react';
import { useSelector } from 'react-redux';

import Player from '../Player/Player';
import PlayerForm from '../PlayerForm/PlayerForm';

function Players() {
  const players = useSelector((state) => state.players);

  return players.map((player) =>
    player.isEdit ? (
      <PlayerForm key={player.id} player={player} />
    ) : (
      <Player key={player.id} player={player} />
    )
  );
}

export default Players;
