import React from "react";
import Button from "@material-ui/core/Button";
import AuthService from "../../services/AuthService";
import openSoc from "../../services/api";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import ErrorPopup from "../../services/ErrorPopup";

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessCode: props.room.accessCode,
      id: props.room.id,
      users: props.room.users,
      open: props.room.open,
      openError: false,
      status_code: "",
      error_message: "",
      votingOpen: props.room.votingOpen,
    };
    this.Auth = new AuthService();
    this.deleteRoom = this.deleteRoom.bind(this);
    this.toggleRoom = this.toggleRoom.bind(this);
    this.closeError = this.closeError.bind(this);
    this.toggleVoting = this.toggleVoting.bind(this);
    this.renderVotes = this.renderVotes.bind(this);
  }

  componentDidMount() {
    if (this.Auth.loggedIn()) {
      this.io = openSoc(this.Auth.getToken());
      this.io.on("newuser", (data) =>
        this.setState({ users: [...this.state.users, data] })
      );
      this.io.on("vote", (data) => {
        let users = this.state.users;
        users.find((o, i) => {
          if (
            o.firstName === data[0] &&
            o.lastName === data[1] &&
            o.school === data[2]
          ) {
            users[i].vote = data[3];
            return true;
          }
          return false;
        });
        this.setState({ users: users });
      });
    }
  }

  closeError() {
    this.setState({ openError: false });
  }

  componentWillUnmount() {
    this.io.disconnect();
  }

  deleteRoom() {
    this.Auth.fetch(
      "/api/room",
      { method: "DELETE", body: JSON.stringify({ room: this.state.id }) },
      (res, status) => {
        if (status >= 400) {
          this.setState({
            openError: true,
            status_code: status,
            error_message: res.error,
          });
        } else this.props.disable(res);
      }
    );
  }

  toggleRoom() {
    this.Auth.fetch(
      "/api/toggle_open",
      { method: "POST" },
      function (res, status) {
        if (status >= 400) {
          this.setState({
            openError: true,
            status_code: status,
            error_message: res.error,
          });
        }
        this.setState({ open: !this.state.open });
      }.bind(this)
    );
  }

  toggleVoting() {
    this.Auth.fetch(
      "/api/toggle_voting",
      { method: "POST" },
      function (res, status) {
        if (status >= 400) {
          this.setState({
            openError: true,
            status_code: status,
            error_message: res.error,
          });
        }
        this.setState({ votingOpen: !this.state.votingOpen });
      }.bind(this)
    );
  }

  renderVotes() {
    let arr = [0, 0, 0];
    for (let i = 0; i < this.state.users.length; i++) {
      if (this.state.users[i].vote === "yea") arr[0]++;
      if (this.state.users[i].vote === "abstain") arr[1]++;
      if (this.state.users[i].vote === "nay") arr[2]++;
    }
    return (
      <div>
        <span style={{ color: "green" }}>{arr[0]}</span> /{" "}
        <span style={{ color: "grey" }}>{arr[1]}</span> /{" "}
        <span style={{ color: "red" }}>{arr[2]}</span>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.openError ? (
          <ErrorPopup
            closeError={this.closeError}
            status_code={this.state.status_code}
            error_message={this.state.error_message}
          />
        ) : null}
        <div>Active room: {this.state.id}</div>
        <div>Code: {this.state.accessCode}</div>
        <Button onClick={this.toggleRoom} color="primary">
          {this.state.open === false ? "Open Room" : "Close Room"}
        </Button>
        <Button onClick={this.toggleVoting} color="default">
          {this.state.votingOpen === false ? "Open for Voting" : "Close Voting"}
        </Button>
        <Button onClick={this.deleteRoom} color="secondary">
          Delete Room
        </Button>
        <h4 style={{ marginTop: ".5em" }}>{this.renderVotes()}</h4>
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
                      <TableCell>{x.firstName}</TableCell>
                      <TableCell>{x.lastName}</TableCell>
                      <TableCell>{x.school}</TableCell>
                      <TableCell>{x.vote}</TableCell>
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
