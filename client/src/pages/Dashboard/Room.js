import React from "react";

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
    };
  }

  render() {
    return (
      <div>
        <div>Active room: {this.state.room.id}</div>
        <div>Code: {this.state.room.accessCode}</div>
      </div>
    );
  }
}

export default Room;
