import React from 'react';

import { useSelector } from 'react-redux';
import COLORS from '../../constants/colors.constants';
import Team from '../Team/Team';
import styles from './Teams.module.css';

function Teams() {
  const { teams, maxScore } = useSelector((state) => state.teams);

  console.log(teams);

  return (
    <div className={styles.teams}>
      {teams.map((team, index) => (
        <Team
          maxScore={maxScore}
          index={index}
          color={COLORS[index]}
          team={team}
          key={team.id}
        />
      ))}
    </div>
  );
}

export default Teams;
