import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
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
  yea: {
    backgroundColor: "lightgreen",
  },
  nay: {
    backgroundColor: "#ffcccb",
  },
  abs: {
    backgroundColor: "lightgray",
  },
  wrap: {
    wordWrap: "anywhere",
  },
}));

const headCells = [
  { id: "time", label: "Time", width: "10%" },
  { id: "id", label: "Name", width: "12.5%" },
  { id: "byline", label: "Byline", width: "65%" },
  { id: "yea", label: "Yea", width: "2.5%" },
  { id: "abs", label: "Abs", width: "2.5%" },
  { id: "nay", label: "Nay", width: "2.5%" },
  { id: "vote", label: "Vote", width: "5%" },
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
                <TableCell style={{ width: cell.width }} key={cell.id}>
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rooms.map((room, index) => (
              <TableRow hover key={index}>
                <TableCell>
                  {new Date(room.time).toLocaleString(
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      hour12: "false",
                      minute: "2-digit",
                    }
                  )}
                </TableCell>
                <TableCell className={classes.wrap}>{room.id}</TableCell>
                <TableCell className={classes.wrap}>{room.byline}</TableCell>
                <TableCell style={{ color: "green" }}>{room.yea}</TableCell>
                <TableCell style={{ color: "grey" }}>{room.abs}</TableCell>
                <TableCell style={{ color: "red" }}>{room.nay}</TableCell>
                <TableCell>
                  {room.yea > room.nay ? (
                    <Button className={classes.yea} disableRipple>
                      YEA
                    </Button>
                  ) : room.nay > room.yea ? (
                    <Button className={classes.nay} disableRipple>
                      NAY
                    </Button>
                  ) : (
                    <Button className={classes.abs} disableRipple>
                      ABS
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        rowsPerPage={10}
        count={props.maxPages}
        page={props.page}
        onChangePage={(_, newPage) => {
          console.log(newPage);
          props.setPage(newPage);
        }}
        component="div"
      />
    </Paper>
  );
}
