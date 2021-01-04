import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import Layout from "../layout/index";

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
    <Layout auth={auth}>
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
          path="/convention/:conventionId"
          render={(props) => <Vote {...props} auth={auth} />}
        />
        <Route
          path="/convention/:conventionId/rooms"
          render={(props) => <Rooms {...props} auth={auth} />}
        />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}
