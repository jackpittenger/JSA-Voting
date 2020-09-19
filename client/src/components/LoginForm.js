import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import history from "../services/history";
import ErrorPopup from "./ErrorPopup";

export default function Header(props) {
  const [token, setToken] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState({
    open: false,
    statusCode: "",
    errorMessage: "",
  });

  function handleFormSubmit(e) {
    e.preventDefault();

    props.auth
      .login(token, pin)
      .then(() => {
        history.push("/dashboard/");
      })
      .catch((err) => {
        setError({
          open: true,
          statusCode: err.response.status,
          errorMessage: err.response.data.error,
        });
      });
  }

  useEffect(() => {
    if (props.auth.loggedIn()) history.replace("/dashboard/");
  });

  return (
    <Dialog open={true}>
      {error.open ? (
        <ErrorPopup
          closeError={setError}
          status_code={error.statusCode}
          error_message={error.errorMessage}
        />
      ) : null}
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          If you've been giving authorization, please enter the credentials
          below:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="token"
          id="token"
          label="Token"
          type="text"
          onChange={(e) => setToken(e.target.value)}
          value={token}
          fullWidth
        />
        <TextField
          margin="dense"
          name="pin"
          id="pin"
          label="Pin"
          type="password"
          onChange={(e) => setPin(e.target.value)}
          value={pin}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setFormEnabled(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
