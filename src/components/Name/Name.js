import React from 'react';
import styles from './Name.module.css';
function Name({ playerName, editName, deleteName }) {
	return (
		<div className={styles.list__item}>
			<span>{playerName}</span>
			<div>
				<span onClick={editName} className={styles.player__icon}>
					&#x270E;
				</span>
				<span onClick={deleteName} className={styles.player__icon}>
					&#x292B;
				</span>
			</div>
		</div>
	);
}

export default Name;
