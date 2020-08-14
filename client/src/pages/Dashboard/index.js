import React from "react";

import withAuth from "../../services/withAuth";
import Header from "../../components/Header";
import AuthService from "../../services/AuthService";
import Mod from "./Mod";
import Admin from "./Admin";
import Dev from "./Dev";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      permissions: "",
    };
    this.Auth = new AuthService();
  }

  componentDidMount() {
    let data = this.Auth.getProfile();
    this.setState({
      name: data.token,
      permissions: data.permissions,
    });
  }

  render() {
    return (
      <div className="App">
        <Header auth={this.Auth} />
        {this.state.permissions.indexOf("Mod") !== -1 ? <Mod /> : null}
        {this.state.permissions.indexOf("Admin") !== -1 ? <Admin /> : null}
        {this.state.permissions.indexOf("Dev") !== -1 ? <Dev /> : null}
      </div>
    );
  }
}

export default withAuth(Dashboard);
