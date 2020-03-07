import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.showLoginForm = this.showLoginForm.bind(this);
    }

    showLoginForm() {

    }
    render(){
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        JSA Voting
                    </Typography>
                    <Button onClick={this.showLoginForm} style={{marginLeft: 'auto'}} color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Header;