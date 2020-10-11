import React, { useState } from "react";

import withDialog from "./withDialog";
import ErrorPopup from "./ErrorPopup";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function CreateUser(props) {
  const [name, setName] = useState("");

  function createUser() {
    props.auth.fetch(
      "/api/create_user",
      {
        method: "POST",
        body: JSON.stringify({ name: name, type: props.type }),
      },
      givePin
    );
  }

  function givePin(result, status) {
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
      />
      <Button onClick={createUser} color="primary">
        Create a new {props.type}
      </Button>
    </div>
  );
}

export default withDialog(ErrorPopup(CreateUser));
