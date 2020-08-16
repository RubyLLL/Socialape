import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

// Redux Stuff
import {connect } from 'react-redux'
import PropTypes from 'prop-types'


// Material UI
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
// Icons
import HomeIcon from '@material-ui/icons/Home'
import NotifButton from '@material-ui/icons/Notifications'

// From the project
import MyButton from '../utils/myButton'
import PostScream from '../components/Scream/PostScream'

class Navbar extends Component {

    render() {
        const { user } = this.props
        return (
            <AppBar>
                <Toolbar className='nav-container'>
                    {/* NOTE margin:auto will bring buttons to the middle */}
                    {user.authenticated ? (
                        <Fragment>
                            <PostScream />
                            <Link to='/'>
                                <MyButton tip='Home'>
                                    <HomeIcon color='primary' />
                                </MyButton>
                            </Link>
                            <MyButton tip='Notification'>
                                <NotifButton color='primary' />
                            </MyButton>
                        </Fragment>
                    ) : (
                        // not authenticated
                        <Fragment>
                            <Button color='inherit' component={Link} to='/login'>Login</Button>
                            <Button color='inherit' component={Link} to='/'>Home</Button>
                            <Button color='inherit' component={Link} to='/signup'>Signup</Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}


Navbar.propTypes = {
    user: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps, {})(Navbar)
