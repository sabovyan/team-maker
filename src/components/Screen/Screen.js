import React from 'react';
import styles from './Screen.module.css';
export default function Screen({ children }) {
	return (
		<div className={styles.screen}>
			<ul className={styles.list}>{children}</ul>
		</div>
	);
}
