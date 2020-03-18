import React, { Component } from 'react';
import AuthService from './AuthService';
import history from "./history";

export default function withAuth(AuthComponent) {
    const Auth = new AuthService('http://localhost:3000');
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentDidMount() {
            if (!Auth.loggedIn()) {
                history.replace('/')
            } else {
                try {
                    const profile = Auth.getProfile();
                    this.setState({
                        user: profile
                    })
                } catch (err) {
                    Auth.logout();
                    history.replace('/')
                }
            }
        }

        render() {
            if (this.state.user) {
                return (
                    <AuthComponent user={this.state.user}/>
                )
            } else {
                return null
            }
        }
    }
}