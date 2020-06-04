import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

class ErrorPopup extends React.Component {
  render() {
    return (
      <Dialog open={true}>
        <DialogTitle id="form-dialog-title">
          Error {this.props.status_code}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.error_message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeError} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ErrorPopup;
