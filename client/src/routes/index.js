import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Vote from "../pages/Vote";
import Convention from "../pages/Convention";
import NotFound from "../pages/NotFound";
import Rooms from "../pages/Rooms";
import history from "../services/history";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Convention} />
      <Route history={history} path="/dashboard" component={Dashboard} />
      <Route path="/convention/:conventionId" component={Vote} />
      <Route path="/convention/:conventionId/rooms" components={Rooms} />
      <Route component={NotFound} />
    </Switch>
  );
}
