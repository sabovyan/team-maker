import React from 'react';

import AddPlayers from './pages/AddPlayers';

function App() {
  return (
    <>
      <h1>te|am</h1>
      <AddPlayers />
    </>
  );
}

export default App;

/*
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

  handleNumberOfTeamsInput = ({ target: { value } }) => {
    this.setState({
      teams: Number(value),
    });
  };

  // handleNumberCheckboxInput = (e) => {
  //   if (e.target.checked) {
  //     this.setState({
  //       trackerIsChecked: true,
  //     });
  //   } else {
  //     this.setState({
  //       trackerIsChecked: false,
  //     });
  //   }
  // };

  // handleNumberSubmit = (e) => {
  //   e.preventDefault();
  //   try {
  //     if (this.state.players.length === 0) {
  //       throw new Error('🤔');
  //     }
  //     if (
  //       this.state.teams === 0 ||
  //       this.state.teams === null ||
  //       this.state.teams === undefined ||
  //       this.state.teams === ''
  //     ) {
  //       throw new Error('😡');
  //     }
  //     this.setState({
  //       shuffledNames: this.state.players
  //         .slice()
  //         .sort(() => Math.random() - 0.5),
  //       shuffledIsReady: true,
  //     });
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  // const { players, nameValue, trackerIsChecked } = this.state;
  // console.log(this.state.shuffledNames);
  
  
  
  <div className={styles.app}>
          <div className={styles.forms}>
            <Form onSubmit={this.handleNameSubmit} style={styles.form}>
              <Input
                autoFocus={true}
                onChange={this.handleNameInput}
                type={'text'}
                labelName={'Names Of The Players'}
                value={nameValue}
              />
            </Form>

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
          </div>
        </div> */
