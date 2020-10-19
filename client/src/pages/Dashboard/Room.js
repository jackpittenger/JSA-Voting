import React, { useState, useEffect } from "react";

import openSoc from "../../services/api";
import ErrorPopup from "../../components/ErrorPopup";

import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const headCells = [
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "school", label: "School" },
  { id: "vote", label: "Vote" },
];

function Room(props) {
  const [room, setRoom] = useState({
    accessCode: props.room.accessCode,
    id: props.room.id,
    users: props.room.users,
    open: props.room.open,
    votingOpen: props.room.votingOpen,
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstName");
  const [byline, setByline] = useState(props.room.byline || "");
  const [speaker, setSpeaker] = useState("");
  const [delay, setDelay] = useState(null);

  useEffect(() => {
    if (props.auth.loggedIn()) {
      const io = openSoc(props.auth.getToken());
      io.on("newuser", (data) =>
        setRoom({ ...room, users: [...room.users, data] })
      );
      io.on("vote", (data) => {
        let users = room.users;
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
        setRoom({ ...room, users: users });
      });
      return () => {
        io.disconnect();
      };
    }
  }, [props.auth, room]);

  function handleByline(value) {
    clearTimeout(delay);
    setByline(value);
    if (value.length <= 120)
      setDelay(
        setTimeout(() => {
          fetchByline(value);
        }, 2000)
      );
  }

  function fetchByline(value) {
    props.auth.fetch(
      "/api/room_byline",
      { method: "PATCH", body: JSON.stringify({ byline: value }) },
      function (res, status) {
        if (status >= 400) {
          props.createError(status, res.error);
        }
      }
    );
  }
  function deleteRoom() {
    props.auth.fetch(
      "/api/room",
      { method: "DELETE", body: JSON.stringify({ room: room.id }) },
      (res, status) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else props.disable(res);
      }
    );
  }

  function toggleRoom() {
    props.auth.fetch("/api/toggle_open", { method: "POST" }, function (
      res,
      status
    ) {
      if (status >= 400) {
        props.createError(status, res.error);
      } else setRoom({ ...room, open: !room.open });
    });
  }

  function toggleVoting() {
    props.auth.fetch("/api/toggle_voting", { method: "POST" }, function (
      res,
      status
    ) {
      if (status >= 400) {
        props.createError(status, res.error);
      } else setRoom({ ...room, votingOpen: !room.votingOpen });
    });
  }

  function renderVotes() {
    let arr = [0, 0, 0];
    for (let i = 0; i < room.users.length; i++) {
      if (room.users[i].vote === "yea") arr[0]++;
      if (room.users[i].vote === "abstain") arr[1]++;
      if (room.users[i].vote === "nay") arr[2]++;
    }
    return (
      <div>
        <span style={{ color: "green" }}>{arr[0]}</span> /{" "}
        <span style={{ color: "grey" }}>{arr[1]}</span> /{" "}
        <span style={{ color: "red" }}>{arr[2]}</span>
      </div>
    );
  }

  function deleteUser(first, last, school) {
    props.auth.fetch(
      "/api/delete_user",
      {
        method: "DELETE",
        body: JSON.stringify({
          first: first,
          last: last,
          school: school,
          code: room.accessCode,
        }),
      },
      (res, status) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          if (res.success) {
            let arr = room.users.filter((val) => {
              if (
                val.firstName === first &&
                val.lastName === last &&
                val.school === school
              )
                return false;
              return true;
            });
            setRoom({ ...room, users: arr });
          }
        }
      }
    );
  }

  function closeRoom() {
    props.auth.fetch("/api/conclude_room", { method: "PATCH" }, function (
      res,
      status
    ) {
      if (status >= 400) {
        props.createError(status, res.error);
      } else props.disable();
    });
  }

  function handleSortRequest(event) {
    setOrder(orderBy === event && order === "asc" ? "desc" : "asc");
    setOrderBy(event);
  }

  function descendingComparator(a, b) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function sort(array) {
    let stabilizedArray = array.map((el, index) => [el, index]);
    stabilizedArray.sort((a, b) => {
      let change =
        order === "asc"
          ? -descendingComparator(a[0], b[0])
          : descendingComparator(a[0], b[0]);
      if (change !== 0) return change;
      return a[1] - b[1];
    });
    return stabilizedArray.map((el) => el[0]);
  }

  return (
    <div>
      <h3>{room.id}</h3>
      <div>Code: {room.accessCode}</div>
      <TextField
        id="byline"
        label="Byline"
        multiline
        rowsMax={3}
        value={byline}
        onChange={(e) => handleByline(e.target.value)}
        error={byline.length > 120}
        helperText="Maxmimum of 120 characters"
        style={{ width: "25em" }}
      />
      <br />
      <br />
      <Button onClick={toggleRoom} color="primary">
        {room.open === false ? "Open Room" : "Close Room"}
      </Button>
      <Button onClick={toggleVoting} color="default">
        {room.votingOpen === false ? "Open for Voting" : "Close Voting"}
      </Button>
      <Button onClick={deleteRoom} color="secondary">
        Delete Room
      </Button>
      <Button onClick={closeRoom} color="primary">
        Conclude
      </Button>
      <h4>Speaker list:</h4>
      <TextField
        id="speaker"
        label="Speaker Name"
        value={speaker}
        onChange={(e) => setSpeaker(e.traget.value)}
      />
      <IconButton>
        <AddCircleOutlineIcon color="primary" />
      </IconButton>
      <h4 style={{ marginTop: ".5em" }}>{renderVotes()}</h4>
      <h3>Users:</h3>
      <Paper style={{ marginLeft: "3%", marginRight: "3%" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    padding={headCell.disablePadding ? "none" : "default"}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleSortRequest(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sort(room.users).map((x, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    <TableCell>{x.firstName}</TableCell>
                    <TableCell>{x.lastName}</TableCell>
                    <TableCell>{x.school}</TableCell>
                    <TableCell
                      style={{
                        color:
                          x.vote === "yea"
                            ? "green"
                            : x.vote === "nay"
                            ? "red"
                            : "grey",
                      }}
                    >
                      {x.vote}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          deleteUser(x.firstName, x.lastName, x.school)
                        }
                        color="secondary"
                      >
                        Remove
                      </Button>
                    </TableCell>
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

export default ErrorPopup(Room);
