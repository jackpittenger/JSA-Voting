import React from 'react';
import {TextField, MenuItem} from '@material-ui/core';


class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {first_name:'', room_number:''};
        this.rooms = {
            "": [
                "test"
            ],
            "100": [
                "George",
                "Greg",
                "Dan"
            ]
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({...this.state, [event.target.name]: event.target.value});
    }

    render() {
        return (
            <form>
                <div style={{paddingTop:15}}>
                    <TextField
                        name="first_name"
                    id="select-first-name"
                    value={this.state.first_name}
                    onChange={this.handleChange}
                    label="First Name"
                    variant="outlined">
                    </TextField>
                </div>
                <div style={{paddingTop:15}}>
                    <TextField
                        name="room_number"
                        id="room-number"
                        select
                        children={this.state.room_number}
                        value={this.state.room_number}
                        onChange={this.handleChange}
                        label="Room Number"
                        variant="outlined">
                    </TextField>
                    {this.rooms[this.state.room_number].map(option=>(
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </div>
            </form>
        );
    }
}

export default NameForm;