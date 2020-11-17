import React, { useEffect, useState } from 'react';
/* redux */
import { useDispatch } from 'react-redux';
import {
  removePlayer,
  setEditStatus,
} from '../../store/features/players.feature';

/* UI */
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import COLORS from '../../constants/colors.constants';

function Player({ player: { id, name, color } }) {
  const [selectedColor, setSelectedColor] = useState('blue');

  const dispatch = useDispatch();

  const handleDelete = (id) => () => {
    dispatch(removePlayer(id));
  };

  const handleEditStatus = (id) => () => {
    dispatch(setEditStatus(id));
  };

  const getRandomColor = (colors) => {
    const random = Math.floor(Math.random() * colors.length);
    setSelectedColor(colors[random]);
  };

  useEffect(() => {
    getRandomColor(COLORS, setSelectedColor);
  }, []);

  return (
    <li>
      <Chip
        size="small"
        icon={<FaceIcon />}
        label={name}
        onDelete={handleDelete(id)}
        onClick={handleEditStatus(id)}
        color="primary"
        style={{
          backgroundColor: selectedColor,
          height: 36,
          padding: 5,
          margin: '5px 0',
          fontSize: '1rem',
        }}
      />
    </li>
  );
}

export default Player;
