import React from "react";
import Room from "./Room";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import AuthService from "../../services/AuthService";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import ErrorPopup from "../../services/ErrorPopup";

class Mod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      dialogTitle: "",
      firstLine: "",
      room_name: "",
      room: null,
      openError: false,
      status_code: "",
      error_message: "",
    };
    this.Auth = new AuthService();
    this.handleChange = this.handleChange.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.processRoom = this.processRoom.bind(this);
    this.disableRoom = this.disableRoom.bind(this);
    this.closeError = this.closeError.bind(this);
  }

  componentDidMount() {
    this.Auth.fetch("/api/get_room", { method: "POST" }, (res, status) => {
      if (status < 300) this.setState({ initialRoom: res });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  createRoom() {
    this.Auth.fetch(
      "/api/create_room",
      { method: "POST", body: JSON.stringify({ name: this.state.room_name }) },
      (res, status) => {
        if (status >= 400) {
          this.setState({
            openError: true,
            status_code: status,
            error_message: res.error,
          });
        } else this.processRoom(res);
      }
    );
  }

  closeError() {
    this.setState({ openError: false });
  }

  processRoom(res) {
    this.setState({ initialRoom: res });
  }

  closeDialog() {
    this.setState({ openDialog: false });
  }

  disableRoom() {
    this.setState({ initialRoom: null });
  }

  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="stretch">
        {this.state.openError ? (
          <ErrorPopup
            closeError={this.closeError}
            status_code={this.state.status_code}
            error_message={this.state.error_message}
          />
        ) : null}
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
          Mod
          <br />
          {this.state.initialRoom != null ? (
            <Room disable={this.disableRoom} room={this.state.initialRoom} />
          ) : (
            <div>
              <TextField
                name="room_name"
                id="room_name"
                label="Room name"
                type="text"
                onChange={this.handleChange}
                value={this.state.room_name}
              />
              <Button onClick={this.createRoom} color="primary">
                Create a new room
              </Button>
            </div>
          )}
        </Paper>
      </Grid>
    );
  }
}

export default Mod;
