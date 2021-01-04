import React, { useState } from "react";

import DashboardHeader from "../../layout/DashboardHeader";

import withAuth from "../../services/withAuth";

import Mod from "./Mod";
import Admin from "./Admin";
import Dev from "./Dev";

import type AuthService from "../../services/AuthService";

type Props = {
  location: {
    pathname: string;
  };
  auth: AuthService;
};

function Dashboard(props: Props) {
  const role = useState(props.auth.getProfile().role)[0];
  const path = props.location.pathname.split("/");
  const mode = path[path.length - 1];
  return (
    <div>
      <DashboardHeader auth={props.auth} />
      {mode === "dashboard" || mode.length === 0 ? (
        <Mod auth={props.auth} />
      ) : null}
      {mode === "admin" && (role === "ADMIN" || role === "DEV") ? (
        <Admin auth={props.auth} />
      ) : null}
      {mode === "dev" && (role === "ADMIN" || role === "DEV") ? (
        <Dev auth={props.auth} />
      ) : null}
    </div>
  );
}

export default withAuth(Dashboard);
