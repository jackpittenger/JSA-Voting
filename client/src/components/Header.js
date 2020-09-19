import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LoginForm from "./LoginForm";
import history from "../services/history";

export default function Header(props) {
  const [formEnabled, setFormEnabled] = useState(false);
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={() => history.push("/")}>
            <Typography
              style={{ color: "white", textTransform: "none" }}
              variant="h6"
            >
              JSA Voting
            </Typography>
          </Button>
          <Button
            onClick={() => history.push("/rooms")}
            style={{ marginLeft: "auto" }}
            color="inherit"
          >
            Rooms
          </Button>
          {props.auth.loggedIn() ? (
            <Button
              onClick={() => {
                history.push("/dashboard");
              }}
              color="inherit"
            >
              Dashboard
            </Button>
          ) : null}
          <Button
            onClick={() =>
              props.auth.loggedIn()
                ? (props.auth.logout(), history.push("/"))
                : setFormEnabled(true)
            }
            color="inherit"
          >
            {props.auth.loggedIn() ? "Logout" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>
      {formEnabled ? (
        <LoginForm setFormEnabled={setFormEnabled} auth={props.auth} />
      ) : null}
    </div>
  );
}
