import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import logo from './images/logo.png';

import AddPlayers from './pages/AddPlayers';
import SplitPlayers from './pages/SplitPlayers';
import Stepper from './pages/Stepper';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <AddPlayers />
          </Route>
          <Route exact path="/stepper">
            <Stepper />
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
