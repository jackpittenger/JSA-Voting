import React from 'react';

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
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.name} onChange={this.handleChange} />
                </label>
                <label>
                    Room:
                    <select onChange={this.handleRoomSelect}>
                        <option disabled selected>Select a room</option>
                        <option name="100">Room 100</option>
                        <option name="200">Room 200</option>
                        <option name="300">Room 300</option>
                    </select>
                </label>
                <label>
                    <select id="speaker">
                        <option disabled selected>Select a speaker</option>
                    </select>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default NameForm;