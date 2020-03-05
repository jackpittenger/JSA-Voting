import React from 'react';
import {TextField, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core';


class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {first_name:'', room_number:''};
        this.rooms = {
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
            <form style={{paddingTop:15}}>
                <FormControl style={{paddingTop:15}}>
                    <TextField
                        name="first_name"
                    id="select-first-name"
                    value={this.state.first_name}
                    onChange={this.handleChange}
                    label="First Name"
                    variant="outlined">
                    </TextField>
                </FormControl>
                <FormControl variant="outlined" style={{paddingTop:15}}>
                    <InputLabel id="room-number-label">
                        Room
                    </InputLabel>
                    <Select
                        labelId="room-number-label"
                        name="room_number"
                        id="room-number"
                        value={this.state.room_number}
                        onChange={this.handleChange}
                        label="Room Number"
                        >
                        <MenuItem key={"Room Number"} value={""} disabled>
                            Room Number
                        </MenuItem>
                        {Object.keys(this.rooms).map(option=>(
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </form>
        );
    }
}

export default NameForm;