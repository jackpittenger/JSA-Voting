import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function ErrorPopup(Component) {
  return function ErrorWrapped(props) {
    const [error, setError] = useState({
      open: false,
      statusCode: "",
      message: "",
    });
    function closeError() {
      setError({ open: false, statusCode: "", message: "" });
    }
    function createError(statusCode, message) {
      setError({
        open: true,
        statusCode: statusCode,
        message: message,
      });
    }
    return (
      <div>
        <Dialog open={error.open}>
          <DialogTitle id="form-dialog-title">
            Error {error.statusCode}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{error.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeError} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Component createError={createError} {...props} />
      </div>
    );
  };
}
