import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';

class Header extends React.Component {

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
                        id="token"
                        label="Token"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="pin"
                        label="Pin"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handler} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Header;