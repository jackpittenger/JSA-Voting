import React from 'react';
import {TextField} from '@material-ui/core';


class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {first_name:''};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({first_name: event.target.value});
    }

    render() {
        return (
            <form>
                <div>
                    <TextField
                    id="select-first-name"
                    value={this.state.first_name}
                    onChange={this.handleChange}
                    label="First Name"
                    helperText="Please put your first name"
                    variant="outlined">
                        {this.state.first_name}
                    </TextField>
                </div>
            </form>
        );
    }
}

export default NameForm;