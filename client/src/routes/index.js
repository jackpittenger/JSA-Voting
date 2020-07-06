import React from "react";
import Switch from "react-router-dom/Switch";
import Route from "react-router-dom/Route";

import Dashboard from "../pages/Dashboard";
import Vote from "../pages/Vote";
import NotFound from "../pages/NotFound";
import history from "../services/history";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Vote} />
      <Route history={history} path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}
