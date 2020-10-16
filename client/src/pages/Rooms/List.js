import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";

const useStyles = makeStyles(() => ({
  paperList: {
    marginLeft: "5%",
    marginRight: "5%",
  },
  title: {
    flex: "1 1 100%",
    textAlign: "center",
  },
}));

const headCells = [
  { id: "time", label: "Time" },
  { id: "id", label: "Name" },
  { id: "byline", label: "Byline" },
  { id: "yea", label: "Yea" },
  { id: "abs", label: "Abs" },
  { id: "nay", label: "Nay" },
];

export default function List(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.paperList}>
      <br />
      <Typography className={classes.title} variant="h6" component="div">
        Rooms
      </Typography>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {headCells.map((cell) => (
                <TableCell key={cell.id}>{cell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rooms.map((room, index) => (
              <TableRow hover key={index}>
                <TableCell>{room.time}</TableCell>
                <TableCell>{room.id}</TableCell>
                <TableCell>{room.byline}</TableCell>
                <TableCell>{room.yea}</TableCell>
                <TableCell>{room.abs}</TableCell>
                <TableCell>{room.nay}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        rowsPerPage={10}
        count={props.maxPages}
        page={props.page - 1}
        onChangePage={(_, newPage) => {
          console.log(newPage);
          props.setPage(newPage);
        }}
        component="div"
      />
    </Paper>
  );
}
