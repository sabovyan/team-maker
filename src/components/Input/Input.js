import React from 'react';

export default function Input(props) {
	return (
		<section>
			<label>players</label>
			<input
				onChange={props.onChange}
				type="text"
				placeholder="enter names of players"
			/>
		</section>
	);
}
