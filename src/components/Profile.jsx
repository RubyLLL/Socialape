import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

// MUI Stuff
import Button from '@material-ui/core/Button'

// Redux Stuff
import { connect } from 'react-redux'

// Icons

const styles = {

}

class Profile extends Component {
    render() {
        // NOTE this loading is when the profile of the user is loading, which is different from the ui loading
        const { classes, user: { credentials: { handle, createdAt, imageUrl, bio, website, location }, loading } } = this.props
        return (
            <div>
                
            </div>
        )
    }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionToProps = {

}

export default connect(
    mapStateToProps,
    mapActionToProps
)(withStyles(styles)(Profile))
