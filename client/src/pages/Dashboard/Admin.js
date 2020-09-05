import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function Admin(props) {
  const [modName, setModName] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    firstLine: "",
  });

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
    setDialog({
      title: "Created new user " + modName,
      firstLine: "Pin: " + result.pin,
      open: true,
    });
    setModName("");
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Dialog open={dialog.open}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.firstLine}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false })} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
