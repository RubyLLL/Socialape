import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

// Redux Stuff
import { connect } from 'react-redux'
import { editUserDetails } from '../../redux/actions/userAction'

// Mui Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

// Mui Icons
import EditIcon from '@material-ui/icons/Edit'


const styles = (theme) => ({
    ...theme.spreadIt,
    button: {
        float: 'right '
    }
})

class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true })
        this.mapUserDetailsToState(this.props.credentials)
    }
    
    handleClose = () => {
        this.setState({ open: false })
    }

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            location: credentials.location ? credentials.location : '',
            website: credentials.website ? credentials.website : ''
        })
    }

    componentDidMount() {
        this.mapUserDetailsToState(this.props.credentials)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        }
        this.props.editUserDetails(userDetails)
        this.handleClose()
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <Tooltip title='Edit details' placement='top' >
                    <IconButton onClick={this.handleOpen} className={classes.button}>
                        <EditIcon color='primary' />
                    </IconButton>
                </Tooltip>

                <Dialog 
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth='sm'
                >
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        {/* NOTE Dialog will be in charge of submitting the form */}
                        <form>
                            {/* NOTE multiline gives it an area not one line input */}
                            <TextField 
                            name='bio' 
                            type='text' 
                            label='Bio' 
                            multiline 
                            rows='3' 
                            placeholder='A short bio about yourself' 
                            className={classes.TextField} 
                            value={this.state.bio} 
                            onChange={this.handleChange}
                            fullWidth
                            />
                            <TextField 
                            name='website' 
                            type='text' 
                            label='Website' 
                            placeholder='Your personal/professional site' 
                            className={classes.TextField} 
                            value={this.state.website} 
                            onChange={this.handleChange}
                            fullWidth
                            />
                            <TextField 
                            name='location' 
                            type='text' 
                            label='Location'  
                            placeholder='Where you live' 
                            className={classes.TextField} 
                            value={this.state.location} 
                            onChange={this.handleChange}
                            fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color='secondary'>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = ({
    classes: PropTypes.object.isRequired,
    editUserDetails: PropTypes.func.isRequired
})
const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

const mapActionToProps = {
    editUserDetails
}

export default connect(
    mapStateToProps,
    mapActionToProps
)(withStyles(styles)(EditDetails))
