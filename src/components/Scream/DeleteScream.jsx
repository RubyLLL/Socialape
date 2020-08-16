import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

// Redux Stuff
import { connect } from 'react-redux'
import { deleteScream } from '../../redux/actions/dataAction'

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
// Icons
import DeleteOutline from '@material-ui/icons/DeleteOutline'


import MyButton from '../../utils/myButton'

const styles = {
    card: {
        position: 'relative'
    },
    deleteButton: {
        position: 'absolute',
        top: '11%',
        left: '92%'
    }

}


class DeleteScream extends Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open : true })
    }
    handleClose = () => {
        this.setState({ open : false })
    }
    deleteScream = () => {
        this.props.deleteScream(this.props.screamId)
        this.setState({ open: false })
    }
    render() {
        const { classes } = this.props

        return (
            <Fragment>
                <MyButton 
                tip='Delete Scream' 
                onClick={this.handleOpen}
                btnClassName={classes.deleteButton}
                >
                    <DeleteOutline color='secondary'/>
                </MyButton>
                <Dialog
                open={this.state.open}
                handleClose={this.handleClose}
                fullWidth
                maxWidth='sm'
                >
                    <DialogTitle>
                        Are you sure you want to delete this scream?
                    </DialogTitle>
                    <DialogActions>
                        <Button color='primary' onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button color='secondary' onClick={this.deleteScream}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired, 
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
}

const mapActionToProps = ({
    deleteScream
})

export default connect(
    null,
    mapActionToProps
    )(withStyles(styles)(DeleteScream))
