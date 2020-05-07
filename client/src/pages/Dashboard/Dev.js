import React from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AuthService from "../../services/AuthService";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

class Dev extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openDialog: false,
            dialogTitle: "",
            firstLine: "",
            admin_name: ""
        };
        this.Auth = new AuthService();
        this.handleChange = this.handleChange.bind(this);
        this.createAdmin = this.createAdmin.bind(this);
        this.givePin = this.givePin.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    createAdmin(){
        this.Auth.fetch("/api/create_user", {method: "POST",
            body: JSON.stringify({name: this.state.admin_name, type: "admin"})}, this.givePin);
    }

    givePin(pin){
        this.setState({
            dialogTitle: "Created new user "+this.state.admin_name,
            firstLine: "Pin: "+pin.pin,
            openDialog: true,
            admin_name: ""
        });
    }

    closeDialog() {
        this.setState({openDialog: false});
    }


    render(){
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
            >
                <Dialog open={this.state.openDialog}>
                    <DialogTitle>{this.state.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.firstLine}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Paper>
                    Dev
                    <br/>
                    <div>
                        Create a new admin:
                        <TextField
                            name="admin_name"
                            id="admin_name"
                            label="Name"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.admin_name}
                        />
                        <Button onClick={this.createAdmin} color="primary">
                            Create admin
                        </Button>
                    </div>
                </Paper>
            </Grid>
        );
    }
}

export default Dev;