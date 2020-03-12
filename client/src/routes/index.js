import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Vote from '../pages/Vote';
import NotFound from '../pages/NotFound';
import withAuth from '../services/withAuth';

export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Vote} />
            <Route path="/dashboard" component={withAuth(Dashboard)}/>
            <Route component={NotFound} />
        </Switch>
    )
}
