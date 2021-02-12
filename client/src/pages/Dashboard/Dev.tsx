import React from "react";

import CreateUser from "../../components/CreateUser";
import ErrorPopup from "../../components/ErrorPopup";
import withDialog from "../../components/withDialog";
import ButtonTextSingleInput from "../../components/ButtonTextSingleInput";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import type AuthService from "../../services/AuthService";

type Props = {
  createError: Function;
  createDialog: Function;
  auth: AuthService;
};

function Dev(props: Props) {
  function handleNewConvention(result: { name: string }, status: number) {
    if (status >= 400)
      return props.createError(status, "Failed creating a new convention");
    props.createDialog("Created a new convention!", "Name: " + result.name);
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Dev
        <br />
        <CreateUser auth={props.auth} type={"MANAGER"} />
        <br />
        <ButtonTextSingleInput
          auth={props.auth}
          route="/api/convention"
          method="POST"
          returnFunction={handleNewConvention}
          label="Name"
          text="Create a new convention"
          fieldName="name"
          additionalBody={{}}
          minLength={5}
          maxLength={72}
        />
        <br />
        <hr style={{ width: "25em", color: "#8080805c" }} />
        <br />
      </Paper>
    </Grid>
  );
}

export default withDialog(ErrorPopup(Dev));
