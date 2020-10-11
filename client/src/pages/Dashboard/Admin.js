import React, { useState } from "react";

import withDialog from "../../components/withDialog";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

function Admin(props) {
  const [modName, setModName] = useState("");

  function createMod() {
    props.auth.fetch(
      "/api/create_user",
      {
        method: "POST",
        body: JSON.stringify({ name: modName, type: "mod" }),
      },
      givePin
    );
  }

  function givePin(result) {
    props.createDialog("Created new user " + modName, "Pin: " + result.pin);
    setModName("");
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Admin
        <br />
        <div>
          <TextField
            name="mod_name"
            id="mod_name"
            label="Name"
            type="text"
            onChange={(e) => setModName(e.target.value)}
            value={modName}
          />
          <Button onClick={createMod} color="primary">
            Create a new mod
          </Button>
        </div>
      </Paper>
    </Grid>
  );
}

export default withDialog(Admin);
