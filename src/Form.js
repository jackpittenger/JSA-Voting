import React from 'react';
import {TextField, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio} from '@material-ui/core';


class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {first_name:'', room_number:'', last_name: '', speaker: ''};
        this.rooms = {
            "100": [
                "George",
                "Greg",
                "Dan"
            ],
            "200": [
                "Hover",
                "Jen",
                "Lena"
            ],
        };
        this.handleChange = this.handleChange.bind(this);
        this.ShowChoices = this.ShowChoices.bind(this)
        this.ChoicesMenu = this.ChoicesMenu.bind(this);
    }

    handleChange(event) {
        this.setState({...this.state, [event.target.name]: event.target.value});
    }
//register when walk in the room
    // elections
    ShowChoices(){
        return this.rooms[this.state.room_number].map(data => (
                <FormControlLabel control={<Radio color="primary" />}
                                  label={data} labelPlacement="start" value={data} />
            )
        );
    }

    ChoicesMenu(){
        if(Object.keys(this.rooms).indexOf(this.state.room_number) !== -1)
            return (<FormControl component="fieldset">
                <FormLabel style={{width: 200, paddingTop:15}} component="legend">
                    Speaker
                </FormLabel>
                <RadioGroup name="speaker" value={this.state.speaker} onChange={this.handleChange} row>
                    < this.ShowChoices/>
                </RadioGroup>
            </FormControl>);
        return "";
    }

    render() {

        return (
            <form style={{paddingTop:15}}>
                <div>
                    <FormControl style={{width: 200, paddingTop:15}}>
                        <TextField
                            name="first_name"
                            id="select-first-name"
                            value={this.state.first_name}
                            onChange={this.handleChange}
                            label="First Name"
                            variant="outlined">
                        </TextField>
                    </FormControl>
                    <FormControl style={{width: 200, paddingTop:15}}>
                        <TextField
                            name="last_name"
                            id="select-last-name"
                            value={this.state.last_name}
                            onChange={this.handleChange}
                            label="Last Name"
                            variant="outlined">
                        </TextField>
                    </FormControl>
                </div>
                <div>
                    <FormControl style={{width: 200, paddingTop:15}}>
                        <TextField
                            select
                            name="room_number"
                            id="room-number"
                            value={this.state.room_number}
                            onChange={this.handleChange}
                            label="Room Number"
                            variant="outlined"
                        >
                            <MenuItem key={"Room Number"} value={""} disabled>
                                Room Number
                            </MenuItem>
                            {Object.keys(this.rooms).map(option=>(
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                </div>
                <div>
                    <this.ChoicesMenu/>
                </div>
            </form>
        );
    }
}

export default NameForm;