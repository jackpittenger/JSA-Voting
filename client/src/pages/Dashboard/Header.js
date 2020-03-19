import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class Header extends React.Component {

    render(){
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        JSA Voting Dashboard
                    </Typography>
                    <Button onClick={this.props.handler} style={{marginLeft: 'auto'}} color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Header;