import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
    return(
        authenticated === true ? <Route  {...rest} to='/'/> : <Route {...rest} to='login' />
    )

};

export default AuthRoute