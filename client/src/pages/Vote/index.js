import React from 'react';
import './App.css';

import NameForm from "./Form";
import Header from './Header';
import LoginForm from './LoginForm';

class  Vote extends React.Component {

    constructor(props) {
        super(props);
        this.state = {enableForm: false};
        this.loginHandler = this.loginHandler.bind(this);
    }

    loginHandler(){
        this.setState({
            enableForm: !this.state.enableForm
        });
    }

    render(){
        return (
            <div className="App">
                <Header handler={this.loginHandler}/>
                { this.state.enableForm ? < LoginForm handler={this.loginHandler} />: ""}
                <NameForm/>
            </div>
        );
    }
}

export default Vote;
