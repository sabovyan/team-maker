import React from 'react';

export default function Form({ children, onSubmit, style }) {
	return (
		<form className={style} onSubmit={onSubmit}>
			{children}
		</form>
	);
}
