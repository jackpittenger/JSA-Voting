import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function ErrorPopup(props) {
  return (
    <Dialog open={true}>
      <DialogTitle id="form-dialog-title">
        Error {props.status_code}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{props.error_message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeError} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
