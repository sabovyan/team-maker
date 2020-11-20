import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { getPrevStep } from '../../store/features/stepCounter.feature';
import FormTeamBoard from '../FormTeamBoard/FormTeamBoard';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

function ThirdStep() {
  const { players, numberOfGroups } = useSelector((state) => state);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleBack = () => {
    dispatch(getPrevStep());
  };

  const shuffledPlayers = (players) => {
    const input = [...players];
    const output = input.sort(() => Math.random() - 0.5);
    return output;
  };

  const handleFinish = () => {
    const orderedPlayers = shuffledPlayers(players);
    // dispatch(setInitialState({ players: orderedPlayers, numberOfGroups }));
    history.push('/split');
  };
  return (
    <>
      <div className={classes.actionsContainer}>
        <FormTeamBoard />
        <div>
          <Button onClick={handleBack} className={classes.button}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinish}
            className={classes.button}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}

export default ThirdStep;
