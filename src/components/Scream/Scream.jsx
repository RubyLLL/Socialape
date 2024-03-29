import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// Third party libraries
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import MyButton from '../../utils/myButton'
import DeleteScream from './DeleteScream'

// Redux Stuff
import { connect } from 'react-redux'
import { likeScream, unlikeScream } from '../../redux/actions/dataAction'

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
// Icons
import ChatIcon from '@material-ui/icons/Chat'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'



const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}
// HIGHLIGHT functions inside a class are called method
export class Scream extends Component {
    
    likedScream = () => {
        if (
            this.props.user.likes && 
            this.props.user.likes.find(like => like.screamId === this.props.scream.screamId)) 
                return true
        else return false
    }

    // NOTE these two methods are defined in dataAction.js
    likeScream = () => {
        this.props.likeScream(this.props.scream.screamId)
    }
    unlikeScream = () => {
        this.props.unlikeScream(this.props.scream.screamId)
    }
    render() {
        dayjs.extend(relativeTime)
        const { 
            classes, 
            scream: { imageUrl, body, userHandle, createdAt, screamId, likeCount, commentCount }, 
            user: { authenticated, credentials: { handle } } 
        } = this.props

        const likeButton = !authenticated ? (
            <MyButton tip='like'>
                <Link to='/login'>
                    <FavoriteBorder color='primary' />
                </Link>
            </MyButton>
        ) : (
            // we are authenticated
            // NOTE likedScream should be called as a method, otherwise it does not run everytime the value changes
            this.likedScream() ? (
                <MyButton tip='Undo like' onClick={this.unlikeScream}>
                    <FavoriteIcon color='primary' />
                </MyButton>
            ) : (
                <MyButton tip='Like' onClick={this.likeScream}>
                    <FavoriteBorder color='primary' />
                </MyButton>
            )
        )

        // NOTE check if this scream belongs to this user
        const deleteButton = authenticated && handle === userHandle ? (
            <DeleteScream screamId={screamId} />
        ) : null
        return (
            <Card className={classes.card}>
                <CardMedia
                image={imageUrl} 
                title='Profile Image'
                className={classes.image}
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color='primary'>
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    {/* NOTE unlike a react component which is wrapped inside <>, this is actually a variable */}
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <MyButton tip='comments'>
                        <ChatIcon color='primary'/>
                    </MyButton>
                    <span>{commentCount} Comments</span>
                </CardContent>
            </Card>
        )
    }
}

Scream.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
    // NOTE scream is passed by <Scream> in home.js
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionToProps = ({
    unlikeScream,
    likeScream
})

// NOTE video 5:00:00
export default connect(
    mapStateToProps,
    mapActionToProps
)(withStyles(styles)(Scream))
