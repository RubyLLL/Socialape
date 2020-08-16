import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// Redux stuff
import { connect } from 'react-redux'
import { loginUser } from '../redux/actions/userAction'

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = (theme) => ({
    ...theme.spreadIt
})

class login extends Component {
    constructor(){
        super()
        this.state = {
            email: '',
            password: '',
            errors: []
        }
    }
    // NOTE so that the errors will also displayed on the page
    componentWillReceiveProps(nextProps){
        if(nextProps.ui.errors) this.setState({ 
            errors: nextProps.ui.errors 
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const userData = {
            email: this.state.email,
            password: this.state.password
        }

        // NOTE remember to call mapActionToProps
        this.props.loginUser(userData, this.props.history)
        
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        // NOTE loading is actually in the ui state, which is binded into our component
        const { classes, ui: { loading } } = this.props
        const { errors } = this.state
        return (
            <Grid container className={classes.form}>
                <Grid item sm></Grid>
                <Grid item sm>
                    <img 
                    src={'https://raw.githubusercontent.com/hidjou/classsed-react-firebase-client/master/public/icon.png'}
                    alt='monkeyLogo' />
                    <Typography variant='h2' className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit} >
                        <TextField 
                        id='email' 
                        name='email' 
                        type='email' 
                        label='Email' 
                        className={classes.textField} 
                        helperText={errors.email}
                        error={errors.email ? true : false}
                        value={this.state.email} 
                        onChange={this.handleChange} 
                        fullWidth
                        />
                        <TextField 
                        id='password' 
                        name='password' 
                        type='password' 
                        label='Password' 
                        className={classes.textField} 
                        helperText={errors.password}
                        error={errors.password ? true : false}
                        value={this.state.password} 
                        onChange={this.handleChange} 
                        fullWidth
                        />
                        {errors.error && (
                            <Typography variant='body2' className={classes.customError}>
                                {'Wrong credentials, pleae try again'}
                            </Typography>
                        )}
                        <Button 
                        type='submit' 
                        variant='contained' 
                        color='primary' 
                        className={classes.button}
                        disabled={loading}
                        >
                            {loading && <CircularProgress size={30} className={classes.progress} />}
                            LOGIN
                        </Button>
                        <br></br>
                        <small>
                            Don't have an account? <Link className={classes.signupLink} to='/signup'>sign up</Link> 
                        </small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
}

// NOTE brought user and ui from the global state and map into the login component 
const mapStateToProps = (state) => ({
    user: state.user,
    ui: state.ui
})

// NOTE otherwise it shows 'loginUser is not a function' when we call it on line 37
const mapActionsToProps = {
    loginUser
}

export default connect(
    mapStateToProps, 
    mapActionsToProps
)(withStyles(styles)(login))
