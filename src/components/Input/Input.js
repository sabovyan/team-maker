import React from 'react';
import styles from './Input.module.css';

export default function Input(props) {
	return (
		<section className={styles.form__section}>
			<label>{props.labelName}</label>
			<input
				className={styles.input}
				onChange={props.onChange}
				type={props.type}
			/>
		</section>
	);
}
