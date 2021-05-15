import React, { useState } from "react";

import ErrorPopup from "components/ErrorPopup";
import ButtonTextSingleInput from "components/ButtonTextSingleInput";

import { Collapse, Grid, Paper, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import type AuthService from "services/AuthService";

type Props = {
  auth: AuthService;
  createError: Function;
};

const useStyles = makeStyles({
  roomAlert: {
    width: "10em",
    margin: "auto",
  },
});

function Mod(props: Props) {
  const classes = useStyles();
  const [successOpenNewRoom, setSuccessOpenNewRoom] = useState(false);
  function createRoomHandler(res: { error: string }, status: number) {
    if (status >= 400) {
      return props.createError(status, res.error);
    }
    setSuccessOpenNewRoom(true);
    setTimeout(() => setSuccessOpenNewRoom(false), 2000);
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        <div>
          Mod
          <br />
          <Collapse in={successOpenNewRoom}>
            <Alert className={classes.roomAlert}>Room created!</Alert>
          </Collapse>
          <ButtonTextSingleInput
            auth={props.auth}
            route="/api/room"
            method="POST"
            returnFunction={createRoomHandler}
            label="Room Name"
            text="Create a new room"
            fieldName="name"
            additionalBody={{}}
            minLength={1}
            maxLength={48}
          />
        </div>
        <hr />
      </Paper>
    </Grid>
  );
}

export default ErrorPopup(Mod);
