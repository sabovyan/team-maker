import React from 'react';
import styles from './Screen.module.css';
import Players from '../Players/Players';

export default function Screen({ children }) {
  return (
    <div className={styles.screen}>
      <ul className={styles.list}>
        <Players />
      </ul>
    </div>
  );
}
