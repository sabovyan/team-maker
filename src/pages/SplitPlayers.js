import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import Box from '@material-ui/core/Box';
import { Chip } from '@material-ui/core';

import { useSelector, useDispatch } from 'react-redux';
import { shufflePLayers } from '../store/features/players.feature';
import { getPlayersForTeams } from '../store/features/teams.feature';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function SplitPlayers() {
  const { players } = useSelector((state) => state);
  const [value, setValue] = useState(players[0].name);
  const [count, setCount] = useState(0);
  const [outerTime] = useState(new Date().getTime());
  const [timing, setTiming] = useState(1000);
  const [finalTime] = useState(players.length * 1000 * 2);
  const [progress, setProgress] = useState(0);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const innerTime = new Date().getTime();
    let timerId = setInterval(() => {
      setValue(players[count].name);

      if (count >= players.length - 1) {
        setCount(0);
      } else {
        setCount((count) => count + 1);
      }
      setTiming((timing) => timing - 100);
    }, timing);

    if (innerTime >= outerTime + finalTime) {
      dispatch(shufflePLayers());
      dispatch(getPlayersForTeams(players));

      clearInterval(timerId);
      history.push('/game');
    }

    return () => {
      clearInterval(timerId);
    };
  }, [count, dispatch, finalTime, history, outerTime, players, timing]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress < 100 ? prevProgress + 1 : 100
      );
    }, finalTime / 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <Chip icon={<FaceIcon />} label={value} />

      <LinearProgressWithLabel value={progress} />
    </div>
  );
}

export default SplitPlayers;
