import React from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import ErrorPopup from "../../services/ErrorPopup";

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      code: "",
      last_name: "",
      school: "",
      open: false,
      status_code: "",
      error_message: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.closeError = this.closeError.bind(this);
    this.Auth = this.props.auth;
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  closeError() {
    this.setState({ open: false });
  }

  submitCode() {
    axios
      .post("/api/auth_code", {
        first_name: this.state.first_name,
        code: this.state.code,
        last_name: this.state.last_name,
        school: this.state.school,
      })
      .then((res) => this.props.change(res))
      .catch((err) => {
        this.setState({
          open: true,
          status_code: err.response.status,
          error_message: err.response.data.error,
        });
      });
  }

  render() {
    return (
      <form style={{ paddingTop: 15 }}>
        {this.state.open ? (
          <ErrorPopup
            closeError={this.closeError}
            status_code={this.state.status_code}
            error_message={this.state.error_message}
          />
        ) : null}
        <div>
          <FormControl style={{ width: 200, paddingTop: 15 }}>
            <TextField
              name="first_name"
              id="select-first-name"
              value={this.state.first_name}
              onChange={this.handleChange}
              label="First Name"
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ width: 200, paddingTop: 15 }}>
            <TextField
              name="last_name"
              id="select-last-name"
              value={this.state.last_name}
              onChange={this.handleChange}
              label="Last Name"
              variant="outlined"
            ></TextField>
          </FormControl>
        </div>
        <div>
          <FormControl style={{ width: 200, paddingTop: 15 }}>
            <TextField
              name="school"
              id="school"
              value={this.state.school}
              onChange={this.handleChange}
              label="School"
              variant="outlined"
            ></TextField>
          </FormControl>
        </div>
        <div>
          <FormControl style={{ width: 200, paddingTop: 15 }}>
            <TextField
              name="code"
              id="code"
              value={this.state.code}
              onChange={this.handleChange}
              label="Code"
              variant="outlined"
            ></TextField>
          </FormControl>
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={this.submitCode}>
            Next
          </Button>
        </div>
      </form>
    );
  }
}

export default NameForm;
