import React from "react";
import {
  Container,
  Header,
  Menu
} from "semantic-ui-react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "../Home/Home";
import Stats from "../Stats/Stats";
import TestForm from "../TestForm/TestForm";

const App = () => (
  <Router>
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as="a" header>
          Covid Tests App
        </Menu.Item>
        <Menu.Item as={Link} to="/">
          Home
        </Menu.Item>
        <Menu.Item as={Link} to="/test">
          Add Test
        </Menu.Item>
        <Menu.Item as={Link} to="/stats">
          Show stats
        </Menu.Item>
      </Container>
    </Menu>

    <Container text style={{ marginTop: "7em" }}>
      <Header as="h1">Covit Tests App</Header>
      <Switch>
        <Route path="/test">
          <TestForm />
        </Route>
        <Route path="/stats">
          <Stats />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Container>
  </Router>
);

export default App;
