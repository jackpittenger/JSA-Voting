import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import history from "../services/history";

export default function DashboardHeader(props) {
  const permission = props.auth.getProfile().permission;
  return (
    <AppBar style={{ backgroundColor: "#3D78CC" }} position="static">
      <Toolbar>
        <Button onClick={() => history.push("/dashboard")} color="inherit">
          Mod
        </Button>
        {permission >= 2 ? (
          <Button
            onClick={() => history.push("/dashboard/admin")}
            color="inherit"
          >
            Admin
          </Button>
        ) : null}
        {permission >= 3 ? (
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
