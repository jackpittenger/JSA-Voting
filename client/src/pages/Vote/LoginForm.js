import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import history from "../../services/history";
import ErrorPopup from "../../services/ErrorPopup";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      pin: "",
      open: false,
      status_code: "",
      error_message: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.closeError = this.closeError.bind(this);
    this.Auth = props.auth;
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.Auth.login(this.state.token, this.state.pin)
      .then(() => {
        history.push("/dashboard/");
      })
      .catch((err) => {
        this.setState({
          open: true,
          status_code: err.response.status,
          error_message: err.response.data.error,
        });
      });
  }

  closeError() {
    this.setState({ open: false });
  }

  componentDidMount() {
    if (this.Auth.loggedIn()) history.replace("/dashboard/");
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <Dialog open={true}>
        {this.state.open ? (
          <ErrorPopup
            closeError={this.closeError}
            status_code={this.state.status_code}
            error_message={this.state.error_message}
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
            onChange={this.handleChange}
            value={this.state.token}
            fullWidth
          />
          <TextField
            margin="dense"
            name="pin"
            id="pin"
            label="Pin"
            type="text"
            onChange={this.handleChange}
            value={this.state.pin}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handler} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleFormSubmit} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Header;
