import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import { StateProvider } from "./state";

import AuthService from "../services/AuthService";

import Dashboard from "../pages/Dashboard";
import Vote from "../pages/Vote";
import Convention from "../pages/Convention";
import NotFound from "../pages/NotFound";
import Rooms from "../pages/Rooms";
import history from "../services/history";

export default function Routes() {
  const auth = new AuthService();
  return (
    <StateProvider>
      <Router history={history}>
        <div>
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => <Convention {...props} auth={auth} />}
            />
            <Route
              path="/dashboard"
              render={(props) => (
                <Dashboard {...props} history={history} auth={auth} />
              )}
            />
            <Route
              path="/convention/:conventionId/rooms"
              render={(props) => <Rooms {...props} auth={auth} />}
            />
            <Route
              path="/convention/:conventionId"
              render={(props) => <Vote {...props} auth={auth} />}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </StateProvider>
  );
}
