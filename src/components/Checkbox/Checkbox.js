import React from 'react';

import styles from './Checkbox.module.css';

export default function Checkbox(props) {
	return (
		<section className={styles.form__checkbox_section}>
			<label htmlFor={props.htmlFor}>{props.labelName}</label>
			<input
				className={styles.checkbox}
				onChange={props.onChange}
				id={props.id}
				type="checkbox"
				value={props.value}
				checked={props.checked}
			/>
		</section>
	);
}
