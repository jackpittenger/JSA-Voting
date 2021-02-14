import React from "react";

import ErrorPopup from "components/ErrorPopup";
import ButtonTextSingleInput from "components/ButtonTextSingleInput";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import type AuthService from "services/AuthService";

type Props = {
  auth: AuthService;
  createError: Function;
};

function Mod(props: Props) {
  function createRoomHandler(res: { error: string }, status: number) {
    if (status >= 400) {
      return props.createError(status, res.error);
    }
    alert("success");
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        <div>
          Mod
          <br />
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
      </Paper>
    </Grid>
  );
}

export default ErrorPopup(Mod);
