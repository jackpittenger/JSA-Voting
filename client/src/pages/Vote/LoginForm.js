import React from 'react';
import Button from '@material-ui/core/Button';


class Header extends React.Component {

    render(){
        return (
                <Button onClick={this.props.handler} style={{marginLeft: 'auto'}} color="inherit">Login</Button>
        );
    }
}

export default Header;