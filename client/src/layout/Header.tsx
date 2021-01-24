import React, { useState } from "react";

import { useStateContext } from "../routes/state";

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

  const { state } = useStateContext();

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
            style={{
              justifyContent: "center",
              marginTop: "0",
              marginBottom: "0",
            }}
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
            <Grid
              item
              alignItems="center"
              container
              spacing={3}
              style={{
                marginLeft: "auto",
                width: "auto",
                padding: "0",
                marginRight: "0",
                justifyContent: "center",
              }}
            >
              {state.roomsOpen &&
              window.location.pathname.startsWith("/convention") ? (
                <Grid item style={{ marginRight: "inherit" }}>
                  <Button
                    onClick={() => {
                      history.push(window.location.pathname + "/rooms");
                    }}
                    color="inherit"
                  >
                    RESULTS
                  </Button>
                </Grid>
              ) : null}
              {loggedIn ? (
                <Grid item style={{ marginRight: "inherit" }}>
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
              <Grid item style={{ marginRight: "inherit" }}>
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
