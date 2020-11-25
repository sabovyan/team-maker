import React from 'react';

import { useSelector } from 'react-redux';
import Team from '../Team/Team';
import styles from './Teams.module.css';

function Teams() {
  const { teams } = useSelector((state) => state.teams);

  console.log(teams);

  return (
    <div className={styles.teams}>
      {teams.map((team) => (
        <Team team={team} key={team.id} />
      ))}
    </div>
  );
}

export default Teams;
