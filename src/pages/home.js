// rce will do this
import React, { Component } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'

export class home extends Component {
    state = {
        screams: null
    }
    componentDidMount() {
        //ANCHOR the proxy is set to the base url of our firebase, check package.json
        // as well as video 4:50:00
        axios.get('/screams')
        .then(result => {
            console.log(result.data)
            this.setState({
                screams: result.data
            })
        })
        .catch(e => console.log(e))
    }
    render() {
        let recentScreamsMarkup = this.state.screams ? (
            this.state.screams.map(scream => <p>{scream.body}</p>)
        )
        : (<p>Loading...</p>)
        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12} >
                   {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12} >
                    <p>Profile...</p>
                </Grid>
            </Grid>
        )
    }
}

export default home
