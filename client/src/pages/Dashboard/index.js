import React from 'react';
import withAuth from "../../services/withAuth";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token")
        };
    }

    render(){
        return (
            <div>
                {console.table(this.state)}
            </div>
        )
    }
}

export default withAuth(Dashboard);