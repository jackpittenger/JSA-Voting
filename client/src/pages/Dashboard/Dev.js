import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

export default function Dev(props) {
  const [adminName, setAdminName] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    firstLine: "",
  });

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

  function givePin(result) {
    setDialog({
      title: "Created new user " + adminName,
      firstLine: "Pin: " + result.pin,
      open: true,
    });
    setAdminName("");
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
