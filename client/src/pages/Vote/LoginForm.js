import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';
import history from '../../services/history';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {token: "", pin: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(){
        fetch("/api/login",  {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.state.token,
                pin: this.state.pin,
            })
        })
            .then(r =>{
                if(r.status === 200) {
                    history.push("/dashboard/");
                } else if(r.status === 401) {
                    alert("Please try again! Invalid credentials");
                } else {
                    alert("An error has occurred, please try again");
                }
            })
            .catch(err=>{
                console.error(err);
                alert("Error logging in, please try again :)");
            });
        this.props.handler();
    }

    handleChange(event) {
        this.setState({...this.state, [event.target.name]: event.target.value});
    }

    render(){
        return (
            <Dialog open={true}>
                <DialogTitle id="form-dialog-title">Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you've been giving authorization, please enter the credentials below:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="token"
                        id="token"
                        label="Token"
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.token}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        name="pin"
                        id="pin"
                        label="Pin"
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.pin}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handler} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleLogin} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Header;