import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FirstStep from '../components/FirstStep/FirstStep';
import SecondStep from '../components/SecondStep/SecondStep';
import ThirdStep from '../components/ThirdStep/ThirdStep';
import ForthStep from '../components/ForthStep/ForthStep';
import BeforeGameDialog from '../components/BeforeGameDialog/BeforeGameDialog';

const useStyles = makeStyles({
  root: {
    width: '100%',
    flexGrow: 1,
    background: 'white',
    color: 'white',
    borderRadius: 4,
    boxShadow: '0.1px 0.1px 1px #9494948f, -0.1px -0.1px 1px #9494948f',
    transition: 'box-shadow 0.1s easy-in-out',

    '&:hover': {
      boxShadow: '7px 7px 7px #94949469, -5px -5px 7px #94949423',
    },

    '& .MuiButtonBase-root': {
      color: '#0f4c5c',
      padding: 10,
    },
    '& .MuiMobileStepper-dot': {
      background: '0f4c5c',
    },
    '& .MuiMobileStepper-dotActive': {
      background: '#fb8b24',
    },
  },

  container: {
    margin: 16,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: 500,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
  },
});

export default function DotsMobileStepper() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStart = () => {
    setOpen(true);
  };

  const handleConfirmDialog = () => {
    history.push('/split');
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div
          style={{
            height: 500,
            width: '100%',
          }}
        >
          {activeStep === 0 ? (
            <FirstStep />
          ) : activeStep === 1 ? (
            <SecondStep />
          ) : activeStep === 2 ? (
            <ThirdStep />
          ) : activeStep === 3 ? (
            <ForthStep />
          ) : null}
        </div>
        <MobileStepper
          variant="dots"
          steps={4}
          position="static"
          activeStep={activeStep}
          className={classes.root}
          nextButton={
            <Button
              size="small"
              onClick={activeStep !== 3 ? handleNext : handleStart}
              style={{
                color: activeStep === 3 ? '#fb8b24' : '#0f4c5c',
              }}
            >
              {activeStep === 3 ? 'Start' : 'Next'}
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </div>
      <BeforeGameDialog
        open={open}
        handleCloseDialog={handleCloseDialog}
        handleConfirmDialog={handleConfirmDialog}
      />
    </div>
  );
}
