// rce will do this
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'

// From the project
import Scream from '../components/Scream/Scream'
import Profile from '../components/Profile/Profile'

// Redux Stuff
import { connect } from 'react-redux'
import { getScreams } from '../redux/actions/dataAction'

export class home extends Component {

    // NOTE state is delted since we will get screams from props

    componentDidMount() {
        this.props.getScreams()
    }

    render() {
        const { screams, loading } = this.props.data
        let recentScreamsMarkup = !loading ? (
            screams.map(scream => <Scream scream={scream} key={scream.screamId}></Scream>)
        ) : (
            <p>Loading...</p>
        )
        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12} >
                   {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12} >
                    <Profile />
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getScreams: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

const mapActionToProps = ({
    getScreams
})

export default connect(
    mapStateToProps, 
    mapActionToProps
)(home)
