import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// Redux stuff
import { signupUser } from '../redux/actions/userAction'
import { connect } from 'react-redux'

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

class signup extends Component {
    constructor(){
        super()
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            // when press login button, there will be a spinning icon
            errors: []
        }
    }

    // NOTE to display errors on the page (otherwise only displays in redux dev tool)
    componentWillReceiveProps = (nextProps) => {
        if(nextProps.ui.errors) {
            this.setState({ errors: nextProps.ui.errors })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ 
            loading: true 
        })
        const userData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }

        this.props.signupUser(userData, this.props.history)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
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
                        Signup
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
                        <TextField 
                        id='confirmPassword' 
                        name='confirmPassword' 
                        type='password' 
                        label='Confirm Password' 
                        className={classes.textField} 
                        helperText={errors.confirmPassword}
                        error={errors.confirmPassword ? true : false}
                        value={this.state.confirmPassword} 
                        onChange={this.handleChange} 
                        fullWidth
                        />
                        <TextField 
                        id='handle' 
                        name='handle' 
                        type='handle' 
                        label='Handle' 
                        className={classes.textField} 
                        helperText={errors.handle}
                        error={errors.handle ? true : false}
                        value={this.state.handle} 
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
                            SIGNUP
                        </Button>
                        <br></br>
                        <small>
                            Already have an account? <Link className={classes.signupLink} to='/login'>Log in</Link> 
                        </small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    ui: state.ui,
    user: state.user
})

const mapActionToProps = {
    signupUser
}

export default connect(
    mapStateToProps,
    mapActionToProps
)(withStyles(styles)(signup))
