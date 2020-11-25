import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Game from './pages/Game';

import SplitPlayers from './pages/SplitPlayers';
import Stepper from './pages/Stepper';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Stepper />
        </Route>
        <Route path="/split">
          <SplitPlayers />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
