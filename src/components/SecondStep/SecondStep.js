import React, { useState } from 'react';
/* UI */
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

/* components */
import FormTeamBoard from '../FormTeamBoard/FormTeamBoard';

/* redux */
import { useDispatch } from 'react-redux';
import {
  getNextStep,
  getPrevStep,
} from '../../store/features/stepCounter.feature';
import { setError } from '../../store/features/Error.feature';
import { addNumberOfGroups } from '../../store/features/teams.feature';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(4),
  },
}));

function SecondStep() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [number, setNumber] = useState(2);

  const handleNumberChange = ({ target: { value } }) => {
    dispatch(addNumberOfGroups(value));
    setNumber(value);
  };

  const handleBack = () => {
    dispatch(setError(''));
    dispatch(getPrevStep());
  };

  const handleNext = () => {
    try {
      if (number < 2) {
        throw new Error('🐵 The number of Groups should be at least 2');
      }
      dispatch(addNumberOfGroups(number));
      dispatch(getNextStep());
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <>
      <TextField
        aria-label="number of groups"
        type="number"
        variant="outlined"
        inputProps={{
          min: 2,
        }}
        value={number}
        onChange={handleNumberChange}
      />

      <div className={classes.actionsContainer}>
        <div>
          <Button onClick={handleBack} className={classes.button}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default SecondStep;
