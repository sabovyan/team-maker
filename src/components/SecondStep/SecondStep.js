import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

/* redux */
import { useDispatch } from 'react-redux';
import {
  getNextStep,
  getPrevStep,
} from '../../store/features/stepCounter.feature';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

function SecondStep() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(getPrevStep());
  };

  const handleNext = () => {
    dispatch(getNextStep());
  };
  return (
    <>
      <h2>here</h2>
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
