import React, { useEffect, useState } from 'react';
import COLORS from '../../constants/colors.constants';
/* redux */
import { useDispatch } from 'react-redux';
import {
  removePlayer,
  setEditStatus,
} from '../../store/features/players.feature';

/* UI */
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    color: 'white',
    height: 36,
    padding: 5,
    margin: '5px 0',
    fontSize: '1rem',

    '& .MuiChip-deleteIcon': {
      fill: 'white',
    },
  },
});

function Player({ player: { id, name } }) {
  const [selectedColor, setSelectedColor] = useState('blue');
  const classes = useStyles();

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
    getRandomColor(COLORS);
  }, []);

  return (
    <li>
      <Chip
        className={classes.root}
        size="small"
        icon={
          <FaceIcon
            style={{
              color: 'white',
            }}
          />
        }
        label={name}
        onDelete={handleDelete(id)}
        onClick={handleEditStatus(id)}
        style={{
          backgroundColor: selectedColor,
        }}
      />
    </li>
  );
}

export default Player;
