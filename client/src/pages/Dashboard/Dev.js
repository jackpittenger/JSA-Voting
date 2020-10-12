import React from "react";

import CreateUser from "../../components/CreateUser";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

export default function Dev(props) {
  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Dev
        <br />
        <CreateUser auth={props.auth} type={"admin"} />
      </Paper>
    </Grid>
  );
}
