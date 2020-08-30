import React, { useState } from "react";
import withAuth from "../../services/withAuth";
import Header from "../../components/Header";
import AuthService from "../../services/AuthService";
import Mod from "./Mod";
import Admin from "./Admin";
import Dev from "./Dev";

function Dashboard() {
  const auth = new AuthService();
  const data = auth.getProfile();
  const permissions = useState(data.permissions)[0];

  return (
    <div className="App">
      <Header auth={auth} />
      {permissions.indexOf("Mod") !== -1 ? <Mod auth={auth} /> : null}
      {permissions.indexOf("Admin") !== -1 ? <Admin auth={auth} /> : null}
      {permissions.indexOf("Dev") !== -1 ? <Dev auth={auth} /> : null}
    </div>
  );
}

export default withAuth(Dashboard);
