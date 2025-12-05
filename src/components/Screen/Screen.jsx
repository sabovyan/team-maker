import React from 'react';
import Players from '../Players/Players';

import styles from './Screen.module.css';

export default function Screen() {
  return (
    <div className={styles.screen}>
      <ul className={styles.list}>
        <Players />
      </ul>
    </div>
  );
}
