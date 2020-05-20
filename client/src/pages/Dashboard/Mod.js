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

class Mod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      dialogTitle: "",
      firstLine: "",
      room_name: "",
      room: false,
    };
    this.Auth = new AuthService();
    this.handleChange = this.handleChange.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.processRoom = this.processRoom.bind(this);
  }

  componentDidMount() {
    this.Auth.fetch("/api/get_room", { method: "POST" }, (res) => {
      if (res.error) return;
      this.setState({ room: res });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  createRoom() {
    console.log("Creating a room");
    this.Auth.fetch(
      "/api/create_room",
      { method: "POST", body: JSON.stringify({ name: this.state.room_name }) },
      this.processRoom
    );
  }

  processRoom(res) {
    this.setState({ room: res });
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
          Mod
          <br />
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
          {this.state.room ? <Room room={this.state.room} /> : ""}
        </Paper>
      </Grid>
    );
  }
}

export default Mod;
