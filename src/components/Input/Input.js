import React from 'react';
import styles from './Input.module.css';

export default function Input(props) {
	return (
		<section className={styles.form__section}>
			<label>{props.labelName}</label>
			<input
				autoFocus={props.autoFocus}
				className={styles.input}
				onChange={props.onChange}
				onBlur={props.onBlur}
				type={props.type}
				value={props.value}
			/>
		</section>
	);
}
