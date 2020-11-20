import React /*,  { useCallback, useEffect, useRef, useState } */ from 'react';
// import Teams from '../components/Teams/Teams';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   setInitialState,
//   AddPlayerToTeam,
// } from '../store/features/team.feature';

function SplitPlayers() {
  // const { teamMaker, players, numberOfGroups } = useSelector((state) => state);

  // const dispatch = useDispatch();

  // const [value, setValue] = useState(players[0].name);
  // const [count, setCount] = useState(0);
  // const [teamIndex, SetTeamIndex] = useState(0);

  // const DisplayPlayersOneByOne = useCallback(
  //   (timing) => {
  //     let timerId;

  //     timerId = setInterval(() => {
  //       console.log(teamMaker.players.length);
  //       clearInterval(timerId);
  //       if (!teamMaker.players.length) {
  //         console.log(timerId, 'timerId');
  //       }

  //       console.log(teamIndex);
  //       console.log(teamMaker.numberOfGroups);

  //       if (teamMaker.players.length) {
  //         setValue(teamMaker.players[0].name);
  //       }

  //       if (teamIndex < 1) {
  //         dispatch(AddPlayerToTeam(teamIndex));
  //         SetTeamIndex((state) => state + 1);
  //       } else {
  //         SetTeamIndex(0);
  //         dispatch(AddPlayerToTeam(teamIndex));
  //       }
  //     }, timing);
  //   },
  //   [dispatch, teamIndex, teamMaker.numberOfGroups, teamMaker.players]
  // );

  // useEffect(() => {
  //   DisplayPlayersOneByOne(3000);
  // }, []);

  return (
    <div>
      {/* <div>{value}</div>
      <Teams quantity={numberOfGroups} players={teamMaker.players} /> */}
    </div>
  );
}

export default SplitPlayers;
