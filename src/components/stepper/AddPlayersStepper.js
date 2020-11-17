import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';

/* components */
import Form from '../Form/Form';
import Screen from '../Screen/Screen';
/* redux */
import { useDispatch } from 'react-redux';
import { addPlayer } from '../../store/features/players.feature';
/* styles */
import styles from './Stepper.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiPaper-root': {
      padding: 10,
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

function getSteps() {
  return ['Add players', 'Set number of groups', 'Submit'];
}

// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return `For each ad campaign that you create, you can control how much
//               you're willing to spend on clicks and conversions, which networks
//               and geographical locations you want your ads to show on, and more.`;
//     case 1:
//       return 'An ad group contains one or more ads which target a shared set of keywords.';
//     case 2:
//       return `Try out different ad text to see what brings in the most customers,
//               and learn how to enhance your ads using features like ad extensions.
//               If you run into any problems with your ads, find out how to tell if
//               they're running and how to resolve approval issues.`;
//     default:
//       return 'Unknown step';
//   }
// }

function generateNewId() {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
}
const newId = generateNewId();

export default function AddPlayersStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [player, setPlayer] = useState('');
  const dispatch = useDispatch();

  const handlePlayerInput = ({ target: { value } }) => {
    setPlayer(value);
  };

  const handlePlayerFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const newPlayer = {
        name: player,
        id: newId(),
        isEdit: false,
        draft: '',
      };

      dispatch(addPlayer(newPlayer));
      setPlayer('');
    },
    [dispatch, player]
  );

  return (
    <div className={styles.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Form onSubmit={handlePlayerFormSubmit}>
                <TextField
                  onChange={handlePlayerInput}
                  label="player's name"
                  variant="outlined"
                  value={player}
                />
              </Form>
              <Screen />

              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
