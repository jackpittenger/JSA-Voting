import React, { useState } from "react";

import withAuth from "../../services/withAuth";
import Header from "../../components/Header";
import AuthService from "../../services/AuthService";
import DashboardHeader from "../../components/DashboardHeader";

import Mod from "./Mod";
import Admin from "./Admin";
import Dev from "./Dev";

function Dashboard(props) {
  const auth = new AuthService();
  const permission = useState(auth.getProfile().permission)[0];
  const path = props.location.pathname.split("/");
  const mode = path[path.length - 1];
  return (
    <div className="App">
      <Header auth={auth} />
      <DashboardHeader auth={auth} />
      {(mode === "dashboard" || mode.length === 0) && permission >= 1 ? (
        <Mod auth={auth} />
      ) : null}
      {mode === "admin" && permission >= 2 ? <Admin auth={auth} /> : null}
      {mode === "dev" && permission >= 3 ? <Dev auth={auth} /> : null}
    </div>
  );
}

export default withAuth(Dashboard);
