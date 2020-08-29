import React from 'react';

import Input from '../Input/Input';
import Form from '../Form/Form';
import Name from '../Name/Name';

import styles from './Players.module.css';

function Players(props) {
	function renderPlayers(player) {
		if (player.isEdit) {
			return (
				<li key={player.id}>
					<Form
						onSubmit={props.handlePlayerInputSubmit(player.id)}
						style={styles.form}
					>
						<Input
							autoFocus={player.isEdit ? true : false}
							type={'text'}
							value={player.draftName}
							onChange={props.handlePlayerInputEdit(player.id)}
							onBlur={props.handlePlayerInputSubmit(player.id)}
						/>
					</Form>
				</li>
			);
		}
		return (
			<li key={player.id}>
				<Name
					playerName={player.name}
					deleteName={props.handleDeleteName(player.id)}
					editName={props.handleEditName(player.id)}
				/>
			</li>
		);
	}

	const { Players } = props;

	return <React.Fragment>{Players.map(renderPlayers)}</React.Fragment>;
}

export default Players;

/* {players.map((player) => {
if (player.isEdit) {
return (
<li key={player.id}>
<Form
onSubmit={this.handlePlayerInputSubmit(player.id)}
style={styles.form}
>
<Input
autoFocus={player.isEdit ? true : false}
type={'text'}
value={player.draftName}
onChange={this.handlePlayerInputEdit(player.id)}
onBlur={this.handlePlayerInputSubmit(player.id)}
/>
</Form>
</li>
);
}
return (
<li key={player.id}>
<Name
playerName={player.name}
deleteName={this.handleDeleteName(player.id)}
editName={this.handleEditName(player.id)}
/>
</li>
);
})} */
