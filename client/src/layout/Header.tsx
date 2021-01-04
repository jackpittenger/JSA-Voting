import React, { useState } from "react";

import history from "../services/history";

import LoginForm from "../components/LoginForm";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import type AuthService from "../services/AuthService";

type Props = {
  auth: AuthService;
};

export default function Header(props: Props) {
  const [formEnabled, setFormEnabled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(props.auth.loggedIn());

  function logIn() {
    setFormEnabled(false);
    setLoggedIn(props.auth.loggedIn());
    history.push("/dashboard/");
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Grid
            justify="space-between"
            alignItems="center"
            container
            spacing={4}
          >
            <Grid item>
              <Button onClick={() => history.push("/")}>
                <Typography
                  style={{ color: "white", textTransform: "none" }}
                  variant="h6"
                >
                  JSA Voting
                </Typography>
              </Button>
            </Grid>
            {loggedIn ? (
              <Grid item style={{ marginLeft: "auto", marginRight: "inherit" }}>
                <Button
                  onClick={() => {
                    history.push("/dashboard");
                  }}
                  color="inherit"
                >
                  Dashboard
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                onClick={() =>
                  loggedIn
                    ? (props.auth.logout(),
                      setLoggedIn(false),
                      history.push("/"))
                    : setFormEnabled(true)
                }
                color="inherit"
              >
                {loggedIn ? "Logout" : "Login"}
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {formEnabled ? (
        <LoginForm
          setFormEnabled={setFormEnabled}
          logIn={logIn}
          auth={props.auth}
        />
      ) : null}
    </div>
  );
}
