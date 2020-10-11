import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import history from "../services/history";

export default function DashboardHeader(props) {
  const permissions = props.auth.getProfile().permissions;
  return (
    <AppBar style={{ backgroundColor: "#3D78CC" }} position="static">
      <Toolbar>
        <Button onClick={() => history.push("/dashboard")} color="inherit">
          Mod
        </Button>
        {permissions.indexOf("Admin") !== -1 ? (
          <Button
            onClick={() => history.push("/dashboard/admin")}
            color="inherit"
          >
            Admin
          </Button>
        ) : null}
        {permissions.indexOf("Dev") !== -1 ? (
          <Button
            onClick={() => history.push("/dashboard/dev")}
            color="inherit"
          >
            Dev
          </Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
