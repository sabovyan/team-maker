import React from 'react';
import stlyes from './Button.module.css';
function Button(props) {
	return (
		<button className={stlyes.button} type={props.type} onClick={props.onClick}>
			{props.buttonText}
		</button>
	);
}
export default Button;
