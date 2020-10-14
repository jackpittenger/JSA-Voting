import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const useStyles = makeStyles(() => ({
  paperList: {
    marginLeft: "5%",
    marginRight: "5%",
  },
  title: {
    flex: "1 1 100%",
  },
}));

export default function List(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.paperList}>
      <Typography className={classes.title} variant="h6" component="div">
        Rooms
      </Typography>
      <TableContainer>
        <Table size="medium">
          <TableBody>
            <TableRow hover>
              <TableCell>Cell one</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
