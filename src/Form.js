import React from 'react';
import {FormControl, InputLabel, Input, FormHelperText} from '@material-ui/core';


class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', room: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({name: event.target.value, room: event.target.room});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    handleRoomSelect(event){

        console.log(event.target.value);
    }

    render() {
        return (
            <FormControl>
                <InputLabel htmlFor="name-input">Name</InputLabel>
                <Input id="name-input" aria-describedby="name-input" />
                <FormHelperText id="name-input">Please input first name</FormHelperText>
                <InputLabel htmlFor="name-input">Name</InputLabel>
                <Input id="name-input" aria-describedby="name-input" />
                <FormHelperText id="name-input">Please input first name</FormHelperText>
                <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={age}
                    onChange={handleChange}
                    input={<BootstrapInput />}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        );
    }
}

export default NameForm;