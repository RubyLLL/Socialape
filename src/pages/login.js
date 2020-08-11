import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
            // when press login button, there will be a spinning icon
            loading: false,
            errors: []
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ 
            loading: true 
        })
        const userData = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post('/login', userData)
        .then(result => {
            console.log(result.data)
            localStorage.setItem('FBIdToken', `Bearer ${result.data.userToken}`)
            this.setState({
                loading: false
            })
            // ANCHOR https://reactrouter.com/web/api/history
            // this will redirect us to the home page
            this.props.history.push('/')
        })
        .catch(e => {
            this.setState({
                errors: e.response.data,
                loading: false
            })
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { classes } = this.props
        const { errors, loading } = this.state
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
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(login)
