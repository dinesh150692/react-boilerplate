import React from 'react';
import { hot } from 'react-hot-loader';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Home, About, Topics}  from 'Pages';
import './style.scss';

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>
      <hr />
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Switch location={location}>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/topics" component={Topics} />
          </Switch>
          </CSSTransition>
        </TransitionGroup>
    </div>
  </Router>
);

export default hot(module)(App);
