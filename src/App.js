import React, { Component } from 'react';
import Input from './components/Input/Input';
import Form from './components/Form/Form';
import Screen from './components/Screen/Screen';
import Button from './components/Button/Button';
import styles from './App.module.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			players: [
				'hello',
				'hello',
				'hello',
				'hello',
				'hello',
				'hayk',
				'lilit',
				'sargis',
			],
		};
	}
	render() {
		const { players } = this.state;
		return (
			<>
				<h1>te|am</h1>
				<div className={styles.app}>
					<div className={styles.names}>
						<Form style={styles.form}>
							<Input type={'text'} labelName={'Names Of The Players'} />
						</Form>

						<Screen>
							{players.map((player, idx) => (
								<li key={`${player}${idx}`} className={styles.list__item}>
									<span className={styles.list__player}>{player}</span>
									<span className={styles.player__delete}>x</span>
								</li>
							))}
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
