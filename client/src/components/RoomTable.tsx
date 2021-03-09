import React, { useState } from "react";

import ErrorPopup from "components/ErrorPopup";

import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBody from "@material-ui/core/TableBody";

import type { Room, Voter } from "types/roomDashboard";

const headCells = [
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "school", label: "School" },
  { id: "vote", label: "Vote" },
];

type Props = {
  room: Room;
  deleteUser: Function;
};

function RoomTable(props: Props) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstName");

  function handleSortRequest(event: string) {
    setOrder(orderBy === event && order === "asc" ? "desc" : "asc");
    setOrderBy(event);
  }

  function descendingComparator(a: Voter, b: Voter) {
    //@ts-ignore
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    //@ts-ignore
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function sort(array: Voter[]) {
    let stabilizedArray: { voter: Voter; index: number }[] = array.map(
      (voter, index) => ({
        voter,
        index,
      })
    );
    stabilizedArray.sort((a, b) => {
      let change =
        order === "asc"
          ? -descendingComparator(a.voter, b.voter)
          : descendingComparator(a.voter, b.voter);
      if (change !== 0) return change;
      return a.index - b.index;
    });
    return stabilizedArray.map((el) => el.voter);
  }

  return (
    <Paper style={{ marginLeft: "3%", marginRight: "3%" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    //@ts-ignore
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
            {sort(props.room.Voter).map((x: Voter, i: number) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                  <TableCell>{x.firstName}</TableCell>
                  <TableCell>{x.lastName}</TableCell>
                  <TableCell>{x.school}</TableCell>
                  <TableCell
                    style={{
                      color:
                        x.vote === "YEA"
                          ? "green"
                          : x.vote === "NAY"
                          ? "red"
                          : "grey",
                    }}
                  >
                    {x.vote}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => props.deleteUser(x.id)}
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
  );
}

export default ErrorPopup(RoomTable);
