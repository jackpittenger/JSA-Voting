import React, { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function withDialog(Component) {
  return function DialogWrapped(props) {
    const [dialog, setDialog] = useState({
      open: false,
      title: "",
      firstLine: "",
    });

    function clearDialog() {
      setDialog({
        open: false,
        title: "",
        firstLine: "",
      });
    }

    function createDialog(title, firstLine) {
      setDialog({ open: true, title: title, firstLine: firstLine });
    }

    return (
      <div>
        <Dialog open={dialog.open}>
          <DialogTitle>{dialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialog.firstLine}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={clearDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Component createDialog={createDialog} {...props} />
      </div>
    );
  };
}
