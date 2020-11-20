import React, { useEffect, useState } from 'react';
import Team from '../Team/Team';
import styles from './Teams.module.css';

function Teams({ quantity, players }) {
  // const [team, setTeam] = useState([]);

  useEffect(() => {});

  return (
    <div className={styles.teams}>
      {Array(quantity)
        .fill('Team')
        .map((team, idx) => (
          <Team key={idx} label={`${team} ${idx + 1}`} team={players} />
        ))}
    </div>
  );
}

export default Teams;
