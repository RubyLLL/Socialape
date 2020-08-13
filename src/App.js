import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import jwtDecode from 'jwt-decode'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import { SET_AUTHENTICATED } from './redux/types'
import { logoutUser, getUserData } from './redux/actions/userAction'

// utils
import themeFile from './utils/theme'
import AuthRoute from './utils/AuthRoute'

// Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'

// Components
import Navbar from './components/Navbar'
import Axios from 'axios';

const theme = createMuiTheme(themeFile)

// NOTE this token is stored when user logs in or signs up
const token = localStorage.FBIdToken
if(token){
  const decodedToken = jwtDecode(token)
  // this token is expired
  if(decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = '/login'
  } else {
    store.dispatch({ type: SET_AUTHENTICATED })
    Axios.defaults.headers.common['Authorization'] = token
    store.dispatch(getUserData())
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <div className='App'>
            <Router>
              <Navbar />
              <div className='container'>
                <Switch>
                  <Route exact path='/' component={home}/>
                  <AuthRoute exact path='/login' component={login}/>
                  <AuthRoute exact path='/signup' component={signup}/>
                </Switch>
              </div>
            </Router>
          </div>
        </MuiThemeProvider>
      </Provider>
      );
  }
}

export default App;
