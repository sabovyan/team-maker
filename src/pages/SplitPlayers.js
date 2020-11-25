import React, { useCallback, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function SplitPlayers() {
  const { players } = useSelector((state) => state);
  const [value, setValue] = useState(players[0].name);

  const history = useHistory();
  // const shuffledPlayers = (players) => {
  //   const input = [...players];
  //   const output = input.sort(() => Math.random() - 0.5);
  //   return output;
  // };

  // const orderedPlayers = shuffledPlayers(players);

  // const dispatch = useDispatch();

  const DisplayPlayersOneByOne = useCallback(
    (timing, timeToClearInterval, timerID) => {
      let count = 0;
      const time = new Date().getTime();
      return setInterval(() => {
        const innerTime = new Date().getTime();

        if (innerTime >= time + timeToClearInterval) {
          clearInterval(timerID);
          history.push('/game');
        }
        if (count >= players.length) {
          count = 0;
        }

        setValue(players[count].name);
        count += 1;
      }, timing);
    },
    [players]
  );

  useEffect(() => {
    let timerId = DisplayPlayersOneByOne(1000, 5000, timerId);
    clearInterval(timerId);

    return () => {
      clearInterval(timerId);
    };
  }, [DisplayPlayersOneByOne]);

  return (
    <div>
      <div>{value}</div>
      {/* <Teams quantity={numberOfGroups} players={players} /> */}
    </div>
  );
}

export default SplitPlayers;
