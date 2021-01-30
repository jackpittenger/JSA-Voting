import React, { useState } from "react";

import Layout from "../../layout";

import DashboardHeader from "../../layout/DashboardHeader";

import withAuth from "../../services/withAuth";

import Mod from "./Mod";
import Admin from "./Admin";
import Manager from "./Manager";
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
  let nRole = 0;
  switch (role) {
    case "MOD":
      nRole = 1;
      break;
    case "ADMIN":
      nRole = 2;
      break;
    case "MANAGER":
      nRole = 3;
      break;
    case "DEV":
      nRole = 4;
      break;
  }
  return (
    <Layout auth={props.auth}>
      <DashboardHeader nRole={nRole} />
      {mode === "dashboard" || mode.length === 0 ? (
        <Mod auth={props.auth} />
      ) : null}
      {mode === "admin" && nRole >= 2 ? <Admin auth={props.auth} /> : null}
      {mode == "manager" && nRole >= 3 ? <Manager auth={props.auth} /> : null}
      {mode === "dev" && nRole >= 4 ? <Dev auth={props.auth} /> : null}
    </Layout>
  );
}

export default withAuth(Dashboard);
