import React from "react";
import Button from "@material-ui/core/Button";
import AuthService from "../../services/AuthService";
import { openSoc } from "../../services/api";

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
    };
    this.Auth = new AuthService();
    this.deleteRoom = this.deleteRoom.bind(this);
    this.processDelete = this.processDelete.bind(this);
  }

  componentDidMount() {
    if (this.Auth.loggedIn()) {
      this.io = openSoc(this.Auth.getToken());
    }

    console.log(this.state.room.users);
  }

  componentWillUnmount() {
    this.io.disconnect();
  }

  deleteRoom() {
    this.Auth.fetch(
      "/api/room",
      { method: "DELETE", body: JSON.stringify({ room: this.state.room.id }) },
      this.processDelete
    );
  }

  processDelete() {
    console.log("Done!");
  }

  render() {
    return (
      <div>
        <div>Active room: {this.state.room.id}</div>
        <div>Code: {this.state.room.accessCode}</div>
        <Button onClick={this.deleteRoom} color="secondary">
          Delete room
        </Button>
        <h3>Users:</h3>
        <div>
          {this.state.room.users.map((x, i) => {
            return <li key={i}>{x.firstName + " " + x.lastName}</li>;
          })}
        </div>
      </div>
    );
  }
}

export default Room;
