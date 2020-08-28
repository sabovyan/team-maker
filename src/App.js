import React, { Component } from 'react';
import Input from './components/Input/Input';
import Form from './components/Form/Form';
import Screen from './components/Screen/Screen';
import styles from './App.module.css';

class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<h1>te|am</h1>
				<Screen>
					<li className={styles.list__item}>
						<span className={styles.list__player}>hello</span>
						<span className={styles.player__delete}>X</span>
					</li>
					<li className={styles.list__item}>
						<span className={styles.list__player}>hello</span>
						<span className={styles.player__delete}>X</span>
					</li>
					<li className={styles.list__item}>
						<span className={styles.list__player}>hello</span>
						<span className={styles.player__delete}>X</span>
					</li>
					<li className={styles.list__item}>
						<span className={styles.list__player}>hello</span>
						<span className={styles.player__delete}>X</span>
					</li>
					<li className={styles.list__item}>
						<span className={styles.list__player}>hello</span>
						<span className={styles.player__delete}>X</span>
					</li>
					<li className={styles.list__item}>
						<span className={styles.list__player}>hello</span>
						<span className={styles.player__delete}>X</span>
					</li>
				</Screen>
				<Form>
					<Input />
				</Form>
			</div>
		);
	}
}
export default App;
