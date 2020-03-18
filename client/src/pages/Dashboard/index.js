import React from 'react';

import withAuth from "../../services/withAuth";
import Header from "./Header";
import AuthService from "../../services/AuthService";
import history from "../../services/history";


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {

    }

    handleLogout() {
        this.Auth.logout();
        history.push('/');
    }

    render(){
        return (
            <div className="App">
                <Header handler={this.handleLogout}>

                </Header>
            </div>
        )
    }
}

export default withAuth(Dashboard);