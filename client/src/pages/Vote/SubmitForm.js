import React from "react";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import history from "../../services/history";

class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { vote: null };
    this.Auth = props.auth;
    this.submit = this.submit.bind(this);
    this.processReturn = this.processReturn.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  submit() {
    this.Auth.fetch(
      "/api/submit_form",
      { method: "POST", body: JSON.stringify({ vote: this.state.vote }) },
      this.processReturn
    );
  }

  processReturn() {
    this.Auth.logout();
    history.push("/");
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <form style={{ paddingTop: 15 }}>
        <div>
          <FormControl>
            <FormLabel>Vote</FormLabel>
            <RadioGroup
              name="vote"
              value={this.state.vote}
              onChange={this.handleChange}
            >
              <FormControlLabel value="yea" control={<Radio />} label="Yea" />
              <FormControlLabel value="nay" control={<Radio />} label="Nay" />
              <FormControlLabel
                value="abstain"
                control={<Radio />}
                label="Abstain"
              />
            </RadioGroup>
          </FormControl>
          <div>
            <Button variant="contained" color="primary" onClick={this.submit}>
              Submit
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

export default SubmitForm;
