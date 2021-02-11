import React, { useState, useEffect } from "react";

import withDialog from "./withDialog";
import ErrorPopup from "./ErrorPopup";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import type AuthService from "../services/AuthService";

type Props = {
  auth: AuthService;
  createError: Function;
  createDialog: Function;
  type: string;
};

function CreateUser(props: Props) {
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(false);
  const [buttonValid, setButtonValid] = useState(false);

  useEffect(() => {
    setNameValid(name.length === 0 || (name.length >= 5 && name.length <= 24));
  }, [name]);

  useEffect(() => {
    setButtonValid(name.length !== 0 && nameValid);
  }, [name, nameValid]);

  function createUser() {
    props.auth.fetch(
      "/api/account",
      {
        method: "POST",
        body: JSON.stringify({ token: name, type: props.type }),
      },
      givePin
    );
  }

  function givePin(result: { pin: number }, status: number) {
    if (status >= 400)
      return props.createError(status, "Failed creating a new user");
    props.createDialog(
      "Created a new " + props.type + " user " + name,
      "Pin: " + result.pin
    );
    setName("");
  }

  return (
    <div>
      <TextField
        name="username"
        id="user_name"
        label="Name"
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        error={!nameValid}
        helperText="Between 5-24 characters"
      />
      <Button disabled={!buttonValid} onClick={createUser} color="primary">
        Create a new {props.type}
      </Button>
    </div>
  );
}

export default withDialog(ErrorPopup(CreateUser));
