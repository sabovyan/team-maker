import React, { Component } from 'react';
import Input from './components/Input/Input';
import Form from './components/Form/Form';
import Screen from './components/Screen/Screen';
import Button from './components/Button/Button';
import Players from './components/Players/Players';

import styles from './App.module.css';

function generateNewId() {
	let id = 0;
	return () => {
		id += 1;
		return id;
	};
}
const newId = generateNewId();

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nameValue: '',
			players: [],
		};
	}

	handleNameInput = ({ target: { value } }) => {
		this.setState({
			nameValue: value,
		});
	};

	handleNameSubmit = (e) => {
		e.preventDefault();

		this.setState((prevState) => {
			const player = {
				name: prevState.nameValue,
				id: newId(),
				isEdit: false,
			};

			return {
				players: [...prevState.players, player],
				nameValue: '',
			};
		});
	};

	handleDeleteName = (id) => () =>
		this.setState((prevState) => ({
			players: prevState.players.filter((player) => player.id !== id),
		}));

	handleEditName = (id) => () => {
		this.setState((prevState) => ({
			players: prevState.players.map((player) =>
				player.id === id
					? { ...player, isEdit: !player.isEdit, draftName: player.name }
					: player
			),
		}));
	};

	handlePlayerInputEdit = (id) => (e) => {
		e.target.focus();
		const { value } = e.target;
		this.setState((prevState) => ({
			players: prevState.players.map((player) =>
				player.id === id ? { ...player, draftName: value } : player
			),
		}));
	};

	handlePlayerInputSubmit = (id) => () => {
		this.setState((prevState) => ({
			players: prevState.players.map((player) => {
				if (player.id === id) {
					if (player.draftName.trim() === '') {
						return {
							...player,
							isEdit: !player.isEdit,
							draftName: player.name,
						};
					}
					return { ...player, isEdit: !player.isEdit, name: player.draftName };
				}
				return player;
			}),
		}));
	};

	render() {
		const { players, nameValue } = this.state;
		return (
			<>
				<h1>te|am</h1>
				<div className={styles.app}>
					<div className={styles.names}>
						<Form onSubmit={this.handleNameSubmit} style={styles.form}>
							<Input
								autoFocus={true}
								onChange={this.handleNameInput}
								type={'text'}
								labelName={'Names Of The Players'}
								value={nameValue}
							/>
						</Form>

						<Screen>
							<Players
								Players={players}
								handlePlayerInputSubmit={this.handlePlayerInputSubmit}
								handlePlayerInputEdit={this.handlePlayerInputEdit}
								handleDeleteName={this.handleDeleteName}
								handleEditName={this.handleEditName}
							/>
						</Screen>
					</div>

					<Form style={styles.form}>
						<Input type={'number'} labelName={'Number of the teams'} />
						<Input type={'number'} labelName={'Winning Score'} />
						<Button type="submit" buttonText="Submit" />
					</Form>
				</div>
			</>
		);
	}
}
export default App;
