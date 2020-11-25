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

const useStyles = makeStyles((theme) => ({
  sliderWrapper: {
    width: '100%',
    display: 'flex',

    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0.1px 0.1px 1px #9494948f, -0.1px -0.1px 1px #9494948f',
    transition: 'box-shadow 0.1s ease-in-out',
    borderRadius: 8,
    padding: 8,

    '&:hover': {
      boxShadow: '7px 7px 7px #94949469, -7px -7px 7px #94949423',
    },
  },

  slider: {
    color: '#fb8b24',
  },

  IconButton: {
    padding: 5,
    margin: 10,
  },
}));

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '80%',
          color: '#fb8b24',
        }}
      >
        <Typography
          color="textSecondary"
          variant="h6"
          component="p"
          style={{
            margin: '16px 0 ',
          }}
        >
          Number of Teams
        </Typography>
        <Typography variant="h1" component="h2" align="center">
          {numberOfGroups}
        </Typography>
      </div>

      <div className={classes.sliderWrapper}>
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
