import React from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';

class Admin extends React.Component {

    render(){
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
            >
                <Paper>
                    Admin
                </Paper>
            </Grid>
        );
    }
}

export default Admin;