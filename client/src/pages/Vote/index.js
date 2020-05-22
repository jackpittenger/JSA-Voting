import React from "react";
import "./App.css";

import NameForm from "./NameForm";
import Header from "./Header";
import LoginForm from "./LoginForm";
import SubmitForm from "./SubmitForm";
import AuthService from "../../services/AuthService";

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enableForm: false, submitEnabled: false };
    this.loginHandler = this.loginHandler.bind(this);
    this.submitEnabled = this.submitEnabled.bind(this);
    this.Auth = new AuthService();
  }

  loginHandler() {
    this.setState({
      enableForm: !this.state.enableForm,
    });
  }

  submitEnabled(res) {
    this.Auth.setToken(res.data.token);
    this.setState({
      submitEnabled: true,
    });
  }

  render() {
    return (
      <div className="App">
        <Header handler={this.loginHandler} />
        {this.state.enableForm ? (
          <LoginForm auth={this.Auth} handler={this.loginHandler} />
        ) : (
          ""
        )}
        {!this.Auth.isTokenVoter() ? (
          <NameForm change={this.submitEnabled} auth={this.Auth} />
        ) : (
          ""
        )}
        {this.Auth.isTokenVoter() ? <SubmitForm /> : ""}
      </div>
    );
  }
}

export default Vote;
