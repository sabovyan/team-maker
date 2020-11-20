import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import logo from './images/logo.png';

import AddPlayers from './pages/AddPlayers';
import SplitPlayers from './pages/SplitPlayers';

function App() {
  return (
    <>
      <img width="100" src={logo} alt="logo" />
      <Router>
        <Switch>
          <Route exact path="/">
            <AddPlayers />
          </Route>
          <Route path="/split">
            <SplitPlayers />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
