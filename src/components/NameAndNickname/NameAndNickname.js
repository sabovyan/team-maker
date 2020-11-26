import React, { useState, useEffect } from 'react';
import { ListItemText } from '@material-ui/core';
import COLORS from '../../constants/colors.constants';

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

function NameAndNickname({ index, primary }) {
  const [nickname, setNickname] = useState('');

  const getRandomNumber = (nicknames) => {
    let random = Math.floor(Math.random() * nicknames.length);
    const name = nicknames[random];
    setNickname(name);
    return name;
  };

  useEffect(() => {
    getRandomNumber(nicknames);
  }, []);
  return (
    <>
      <ListItemText
        primary={primary}
        secondary={nickname}
        style={{
          color: COLORS[index],
          fontWeight: 'bolder',
        }}
      />
    </>
  );
}

export default NameAndNickname;
