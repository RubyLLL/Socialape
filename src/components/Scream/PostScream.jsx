import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

// Redux stuff
import { connect } from 'react-redux'
import { postScream } from '../../redux/actions/dataAction'


// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'
// Icons
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'

// From the project
import MyButton from '../../utils/myButton'


const styles = ({
    textField: {
        margin: '10px auto 10px auto'
    },
    submitButton: {
        position: 'relative',
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
})

class PostScream extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    }
    handleOpen = () => {
        this.setState({ open : true })
    }
    handleClose = () => {
        this.setState({ open : false })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.postScream({ body: this.state.body })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        const { errors } = this.state
        const { classes, ui: { loading } } = this.props
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip='post a Scream!'>
                    <AddIcon />
                </MyButton>
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth='sm'
                >
                    <MyButton 
                    tip='Close' 
                    onClick={this.handleClose} 
                    tipClassName={classes.closeButton}
                    >
                        <CloseIcon/>
                    </MyButton>

                    <DialogTitle>Post a new Scream</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                            name='body'
                            type='text'
                            label='scream'
                            multiline
                            rows='3'
                            placeholder='Scream at your fellow apes'
                            error={errors.body ? true : false}
                            helperText={errors.body}
                            className={classes.textField}
                            onChange={this.handleChange}
                            fullWidth
                            />
                            <Button 
                            type='submit' 
                            variant='contained' 
                            color='primary' 
                            className={classes.submitButton}
                            disabled={loading}
                            >
                                Submit
                                {loading && 
                                (<CircularProgress size={30} className={classes.progressSpinner} />)
                                }
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostScream.propTypes = {
    postScream: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    ui: state.ui
})

const mapActionToProps = ({
    postScream
})

export default connect(
    mapStateToProps,
    mapActionToProps
)(withStyles(styles)(PostScream))
