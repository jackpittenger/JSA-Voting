import React, { useState, useEffect } from "react";
import axios from "axios";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LoginForm from "./LoginForm";
import history from "../services/history";

export default function Header(props) {
  const [formEnabled, setFormEnabled] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  useEffect(() => {
    axios.get("/api/rooms_open").then((res) => setRoomsOpen(res.data.open));
  }, []);

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
          <Button style={{ marginLeft: "auto" }}></Button>
          {roomsOpen ||
          (props.auth.loggedIn() && props.auth.getProfile().permission >= 2) ? (
            <Button
              onClick={() => history.push("/rooms")}
              style={{ marginLeft: "auto" }}
              color="inherit"
            >
              Rooms
            </Button>
          ) : null}
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
