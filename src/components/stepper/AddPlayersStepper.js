import React from 'react';
/* redux */
import { useSelector } from 'react-redux';

/* UI */
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

/* components */
import FirstStep from '../FirstStep/FirstStep';
import SecondStep from '../SecondStep/SecondStep';
import ThirdStep from '../ThirdStep/ThirdStep';

/* styles */
import styles from './Stepper.module.css';

export default function AddPlayersStepper() {
  const activeStep = useSelector((state) => state.activeStep);

  return (
    <div className={styles.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Add players</StepLabel>
          <StepContent>
            <FirstStep />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Set number of groups</StepLabel>
          <StepContent>
            <SecondStep />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Submit</StepLabel>
          <StepContent>
            <ThirdStep />
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
}
