import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AuthService from "../../services/AuthService";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      dialogTitle: "",
      firstLine: "",
      mod_name: "",
    };
    this.Auth = new AuthService();
    this.handleChange = this.handleChange.bind(this);
    this.createMod = this.createMod.bind(this);
    this.givePin = this.givePin.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  createMod() {
    this.Auth.fetch(
      "/api/create_user",
      {
        method: "POST",
        body: JSON.stringify({ name: this.state.mod_name, type: "mod" }),
      },
      this.givePin
    );
  }

  givePin(pin) {
    this.setState({
      dialogTitle: "Created new user " + this.state.mod_name,
      firstLine: "Pin: " + pin.pin,
      openDialog: true,
      mod_name: "",
    });
  }

  closeDialog() {
    this.setState({ openDialog: false });
  }

  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="stretch">
        <Dialog open={this.state.openDialog}>
          <DialogTitle>{this.state.dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.state.firstLine}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Paper>
          Admin
          <br />
          <div>
            Create a new mod:
            <TextField
              name="mod_name"
              id="mod_name"
              label="Name"
              type="text"
              onChange={this.handleChange}
              value={this.state.mod_name}
            />
            <Button onClick={this.createMod} color="primary">
              Create mod
            </Button>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default Admin;
