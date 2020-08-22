import React from "react";
import { Router } from "react-router-dom";

import history from "./services/history";
import Routes from "./routes";

export default function App() {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
}
