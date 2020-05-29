import React from "react";
import Button from "@material-ui/core/Button";
import AuthService from "../../services/AuthService";
import { openSoc } from "../../services/api";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessCode: props.room.accessCode,
      id: props.room.id,
      users: props.room.users,
    };
    this.Auth = new AuthService();
    this.deleteRoom = this.deleteRoom.bind(this);
    this.processDelete = this.processDelete.bind(this);
  }

  componentDidMount() {
    if (this.Auth.loggedIn()) {
      this.io = openSoc(this.Auth.getToken());
      this.io.on("newuser", (data) =>
        this.setState({ users: [...this.state.users, data] })
      );
    }
  }

  componentWillUnmount() {
    this.io.disconnect();
  }

  deleteRoom() {
    this.Auth.fetch(
      "/api/room",
      { method: "DELETE", body: JSON.stringify({ room: this.state.id }) },
      this.processDelete
    );
  }

  processDelete() {
    console.log("Done!");
  }

  render() {
    return (
      <div>
        <div>Active room: {this.state.id}</div>
        <div>Code: {this.state.accessCode}</div>
        <Button onClick={this.deleteRoom} color="secondary">
          Delete room
        </Button>
        <h3>Users:</h3>
        <Paper>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>School</TableCell>
                  <TableCell>Vote</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.users.map((x, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      <TableCell key={i}>{x.firstName}</TableCell>
                      <TableCell key={i}>{x.lastName}</TableCell>
                      <TableCell key={i}>{x.school}</TableCell>
                      <TableCell key={i}>{x.vote}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    );
  }
}

export default Room;
