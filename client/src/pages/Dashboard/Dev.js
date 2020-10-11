import React, { useState } from "react";

import withDialog from "../../components/withDialog";
import ErrorPopup from "../../components/ErrorPopup";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function Dev(props) {
  const [adminName, setAdminName] = useState("");

  function createAdmin() {
    props.auth.fetch(
      "/api/create_user",
      {
        method: "POST",
        body: JSON.stringify({ name: adminName, type: "admin" }),
      },
      givePin
    );
  }

  function givePin(result, status) {
    if (status >= 400)
      return props.createError(status, "Failed creating a new user");
    props.createDialog("Created new user " + adminName, "Pin: " + result.pin);
    setAdminName("");
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Dev
        <br />
        <div>
          <TextField
            name="admin_name"
            id="admin_name"
            label="Name"
            type="text"
            onChange={(e) => setAdminName(e.target.value)}
            value={adminName}
          />
          <Button onClick={createAdmin} color="primary">
            Create a new admin
          </Button>
        </div>
      </Paper>
    </Grid>
  );
}

export default withDialog(ErrorPopup(Dev));
