import React from 'react';

/* UI */
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

/* redux */
import { useDispatch, useSelector } from 'react-redux';
import {
  addNumberOfGroups,
  decreaseNumberOfGroupsByOne,
  increaseNumberOfGroupsByOne,
} from '../../store/features/teams.feature';

import styles from './SecondStep.module.css';
import Title from '../Title/Title';

const useStyles = makeStyles({
  slider: {
    color: '#fb8b24',
  },

  IconButton: {
    padding: 5,
    margin: 10,
  },
});

function SecondStep() {
  const { numberOfGroups } = useSelector((state) => state.teams);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleNumberChange = (e, value) => {
    dispatch(addNumberOfGroups(value));
  };

  const handleIncrease = () => {
    if (numberOfGroups < 6) {
      dispatch(increaseNumberOfGroupsByOne());
    }
  };
  const handleDecrease = () => {
    if (numberOfGroups > 2) {
      dispatch(decreaseNumberOfGroupsByOne());
    }
  };

  return (
    <>
      <div className={styles.display}>
        <Title title="Number of Teams" />

        <Typography variant="h1" component="h2" align="center">
          {numberOfGroups}
        </Typography>
      </div>

      <div className={styles.sliderWrapper}>
        <IconButton onClick={handleDecrease} className={classes.IconButton}>
          <ArrowBack />
        </IconButton>

        <Slider
          defaultValue={2}
          valueLabelDisplay="auto"
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={2}
          max={6}
          className={classes.slider}
          value={numberOfGroups}
          onChangeCommitted={handleNumberChange}
        />

        <IconButton onClick={handleIncrease} className={classes.IconButton}>
          <ArrowForward />
        </IconButton>
      </div>
    </>
  );
}

export default SecondStep;
