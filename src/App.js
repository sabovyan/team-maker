import React, { Component } from 'react';
import Input from './components/Input/Input';
import Form from './components/Form/Form';
import Screen from './components/Screen/Screen';
import Button from './components/Button/Button';
import Players from './components/Players/Players';
import Checkbox from './components/Checkbox/Checkbox';

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
			players: [
				{
					name: 'faas',
					isEdit: false,
					draftName: this.name,
					id: newId(),
				},
				{
					name: 'asds',
					isEdit: false,
					draftName: this.name,
					id: newId(),
				},
				{
					name: 'j;lkds',
					isEdit: false,
					draftName: this.name,
					id: newId(),
				},
			],
			trackerIsChecked: false,
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
			try {
				if (prevState.nameValue.trim() === '') {
					throw new Error('🐵');
				} else {
					const player = {
						name: prevState.nameValue,
						id: newId(),
						isEdit: false,
					};
					return {
						players: [...prevState.players, player],
						nameValue: '',
					};
				}
			} catch (err) {
				alert(err.message);
			}
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

	handleNumberOfTeamsInput = ({ target: { value } }) => {
		this.setState({
			teams: Number(value),
		});
	};

	handleNumberCheckboxInput = (e) => {
		if (e.target.checked) {
			this.setState({
				trackerIsChecked: true,
			});
		} else {
			this.setState({
				trackerIsChecked: false,
			});
		}
	};
	/* TODO */
	handleNumberSubmit = (e) => {
		e.preventDefault();
		try {
			if (this.state.players.length === 0) {
				throw new Error('🤔');
			}
			if (
				this.state.teams === 0 ||
				this.state.teams === null ||
				this.state.teams === undefined ||
				this.state.teams === ''
			) {
				throw new Error('😡');
			}
			this.setState((prevState) => {
				const newPlayers = prevState.players;
				const shuffledArray = newPlayers.sort(() => Math.random() - 0.5);
				return {
					shuffledPlayers: shuffledArray,
				};
			});
		} catch (err) {
			alert(err.message);
		}
	};

	render() {
		const { players, nameValue, trackerIsChecked } = this.state;

		return (
			<>
				<h1>te|am</h1>
				<div className={styles.app}>
					<div className={styles.names}>
						<Screen>
							<Players
								Players={players}
								handlePlayerInputSubmit={this.handlePlayerInputSubmit}
								handlePlayerInputEdit={this.handlePlayerInputEdit}
								handleDeleteName={this.handleDeleteName}
								handleEditName={this.handleEditName}
							/>
						</Screen>
						<h2>Add the name of the players</h2>
						<Form onSubmit={this.handleNameSubmit} style={styles.form}>
							<Input
								autoFocus={true}
								onChange={this.handleNameInput}
								type={'text'}
								labelName={'Names Of The Players'}
								value={nameValue}
							/>
						</Form>
					</div>
					<h2>Submit the number of the team </h2>
					<Form onSubmit={this.handleNumberSubmit} style={styles.form}>
						<Input
							onChange={this.handleNumberOfTeamsInput}
							type={'number'}
							labelName={'Number of the teams'}
						/>
						<Checkbox
							onChange={this.handleNumberCheckboxInput}
							labelName={'Score Tracker'}
							htmlFor="checkbox"
							id="checkbox"
							checked={trackerIsChecked}
						/>
						<Button type="submit" buttonText="Submit" />
					</Form>
				</div>
			</>
		);
	}
}
export default App;
