import React from 'react';

import withAuth from "../../services/withAuth";
import Header from "./Header";
import AuthService from "../../services/AuthService";
import history from "../../services/history";
import Mod from "./Mod";
import Admin from "./Admin";
import Dev from "./Dev";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            permissions: ""
        };
        this.Auth = new AuthService();
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        let data = this.Auth.getProfile();
        this.setState({
            name: data.token,
            permissions: data.permissions
        });
    }

    handleLogout() {
        this.Auth.logout();
        history.push('/');
    }

    render(){
        return (
            <div className="App">
                <Header handler={this.handleLogout}/>
                {this.state.permissions.indexOf("Mod") !== -1 ? <Mod /> : ""}
                {this.state.permissions.indexOf("Admin") !== -1 ? <Admin /> : ""}
                {this.state.permissions.indexOf("Dev") !== -1 ? <Dev /> : ""}
            </div>
        )
    }
}

export default withAuth(Dashboard);