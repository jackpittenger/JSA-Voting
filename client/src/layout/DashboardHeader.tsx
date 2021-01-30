import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import history from "../services/history";

type Props = {
  nRole: number;
};

export default function DashboardHeader(props: Props) {
  return (
    <AppBar style={{ backgroundColor: "#3D78CC" }} position="static">
      <Toolbar>
        {props.nRole >= 1 ? (
          <Button onClick={() => history.push("/dashboard")} color="inherit">
            Mod
          </Button>
        ) : null}
        {props.nRole >= 2 ? (
          <Button
            onClick={() => history.push("/dashboard/admin")}
            color="inherit"
          >
            Admin
          </Button>
        ) : null}
        {props.nRole >= 3 ? (
          <Button
            onClick={() => history.push("/dashboard/manager")}
            color="inherit"
          >
            Manager
          </Button>
        ) : null}
        {props.nRole >= 4 ? (
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
