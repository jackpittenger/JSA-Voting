import React from "react";

import CreateUser from "../../components/CreateUser";
import ErrorPopup from "../../components/ErrorPopup";
import withDialog from "../../components/withDialog";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

function Dev(props) {
  function removeRooms() {
    props.auth.fetch("/api/clear_rooms", { method: "DELETE" }, (_, status) => {
      if (status >= 400)
        return props.createError(status, "Failed toggling rooms");
      props.createDialog("Success!", "All rooms deleted");
    });
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Dev
        <br />
        <CreateUser auth={props.auth} type={"admin"} />
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

export default withDialog(ErrorPopup(Dev));
