import React from "react";

import CreateUser from "../../components/CreateUser";
import ErrorPopup from "../../components/ErrorPopup";
import withDialog from "../../components/withDialog";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import type AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
  createError: Function;
  createDialog: Function;
};

function Manager(props: Props) {
  function removeRooms() {
    props.auth.fetch(
      "/api/clear_rooms",
      { method: "DELETE" },
      (_: {}, status: number) => {
        if (status >= 400)
          return props.createError(status, "Failed toggling rooms");
        props.createDialog("Success!", "All rooms deleted");
      }
    );
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Manager
        <br />
        <CreateUser auth={props.auth} type={"ADMIN"} />
        <br />
        <hr style={{ width: "25em", color: "#8080805c" }} />
        <div>
          Delete all concluded rooms
          <Button onClick={removeRooms} color="secondary">
            Remove rooms
          </Button>
        </div>
        <br />
      </Paper>
    </Grid>
  );
}

export default withDialog(ErrorPopup(Manager));
