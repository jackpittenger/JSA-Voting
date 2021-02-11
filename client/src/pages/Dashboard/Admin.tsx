import React, { useState, useEffect } from "react";
import axios from "axios";

import CreateUser from "../../components/CreateUser";
import ErrorPopup from "../../components/ErrorPopup";
import withDialog from "../../components/withDialog";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import type AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
  createDialog: Function;
  createError: Function;
};

function Admin(props: Props) {
  const [roomsOpen, setRoomsOpen] = useState(false);
  useEffect(() => {
    axios.get("/api/rooms_open").then((res) => setRoomsOpen(res.data.open));
  }, []);

  function toggleRoomsOpen() {
    props.auth.fetch(
      "/api/rooms_toggle",
      { method: "PATCH" },
      (_: any, status: number) => {
        if (status >= 400)
          return props.createError(status, "Failed toggling rooms");
        props.createDialog(
          "Success!",
          "Room results turned " + (roomsOpen ? "off" : "on")
        );
        setRoomsOpen(!roomsOpen);
      }
    );
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Admin
        <br />
        <CreateUser auth={props.auth} type={"MOD"} />
        <br />
        <hr style={{ width: "25em", color: "#8080805c" }} />
        {roomsOpen ? (
          <div>
            Room results are viewable by everyone
            <Button onClick={toggleRoomsOpen} color="secondary">
              Hide Rooms
            </Button>
          </div>
        ) : (
          <div>
            Room results are restricted to admins
            <Button onClick={toggleRoomsOpen} color="primary">
              Open to Everyone
            </Button>
          </div>
        )}
        <br />
      </Paper>
    </Grid>
  );
}

export default withDialog(ErrorPopup(Admin));
