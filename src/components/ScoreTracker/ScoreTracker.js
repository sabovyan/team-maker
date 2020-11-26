import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import LinearProgressWithLabel from '../LinearProgressWithLabel/LinearProgressWithLabel';
import styles from './ScoreTracker.module.css';
import { TextField } from '@material-ui/core';
import PointBox from '../PointBox/PointBox';

function ScoreTracker({ maxScore, color }) {
  const [score, setScore] = useState(0);
  const [longPress, setLongPress] = useState(false);
  const [direction, setDirection] = useState(null);
  const [timing, setTiming] = useState(800);
  const [outerTime, setOuterTime] = useState(new Date().getTime());
  const [reward, setReward] = useState(1);
  const [penalty, setPenalty] = useState(1);

  const handleMouseDown = (e) => {
    console.log(e.target.nodeName);
    // console.log(e.target.childNodes);
    // console.log(e.target);
    if (e.target.id === 'back') {
      setDirection('back');
    }
    if (e.target.id === 'forward') {
      setDirection('forward');
    }

    setLongPress(true);
  };
  const handleMouseUp = () => {
    setLongPress(false);
    setDirection(null);
    setTiming(300);
    setOuterTime(new Date().getTime());
  };

  const handleRewardChange = ({ target: { value } }) => {
    setReward(Number(value));
  };

  const handleScoreIncrement = () => {
    setScore((score) => (score < maxScore ? Number(score) + reward : 100));
  };

  const handlePenaltyChange = ({ target: { value } }) => {
    setPenalty(Number(value));
  };

  const handleScoreDecrement = () => {
    setScore((score) => (score > 0 ? Number(score) - penalty : 0));
  };

  useEffect(() => {
    let timerId;

    if (longPress) {
      const innerTime = new Date().getTime();
      timerId = setTimeout(() => {
        // console.log(outerTime);
        if (direction === 'back') {
          setScore((score) => (score > 0 ? Number(score) - penalty : 0));
        } else {
          setScore((score) =>
            score < maxScore ? Number(score) + reward : 100
          );
        }

        if (innerTime > outerTime + 1000) {
          setTiming(100);
        }
        if (innerTime > outerTime + 5000) {
          setTiming(50);
        }
      }, timing);
    }

    return () => {
      clearTimeout(timerId);
    };
  });

  return (
    <div
      style={{
        padding: 10,
      }}
    >
      <Typography
        variant="h4"
        component="h5"
        align="center"
        style={{
          textTransform: 'uppercase',
          color,
        }}
      >
        Score
      </Typography>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={handleScoreDecrement}
          id="back"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={styles.button}
        >
          -
        </button>

        <Typography
          variant="h4"
          component="h5"
          align="center"
          style={{
            textTransform: 'uppercase',
            color,
            width: 100,
          }}
        >
          {score}
        </Typography>
        <button
          onClick={handleScoreIncrement}
          id="forward"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={styles.button}
        >
          +
        </button>
      </div>
      <LinearProgressWithLabel value={(score * 100) / maxScore} color={color} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        <PointBox
          label="Reward"
          color={color}
          value={reward}
          onChange={handleRewardChange}
        />
        <PointBox
          label="Penalty"
          color={color}
          value={penalty}
          onChange={handlePenaltyChange}
        />
      </div>
    </div>
  );
}

export default ScoreTracker;
