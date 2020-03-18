import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';
import AuthService from "../../services/AuthService";
import history from "../../services/history";

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {token: "", pin: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
    }

    handleFormSubmit(e){
        e.preventDefault();

        this.Auth.login(this.state.token,this.state.pin)
            .then(res =>{
                history.push('/dashboard/');
            })
            .catch(err =>{
                alert(err);
            });
        this.props.handler();
    }

    componentDidMount(){
        if(this.Auth.loggedIn())
            history.replace('/dashboard/');
    }


    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
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
                    <Button onClick={this.handleFormSubmit} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Header;