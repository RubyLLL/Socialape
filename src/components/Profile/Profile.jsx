import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// Other Libraries
import dayjs from 'dayjs'

// Other Components
import EditDetails from './EditDetails'

// MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import MuiLink from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ToolTip from '@material-ui/core/Tooltip'

// Redux Stuff
import { connect } from 'react-redux'
import { uploadImage, logoutUser } from '../../redux/actions/userAction'

// Icons
import LocationOn from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import CalendarToday from '@material-ui/icons/CalendarToday'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardReturn from '@material-ui/icons/KeyboardReturn'

const styles = (theme) => ({
    paper: {
        padding: 20
      },
    profile: {
        '& .image-wrapper': {
          textAlign: 'center',
          position: 'relative',
          '& button': {
            position: 'absolute',
            top: '80%',
            left: '70%'
          }
        },
        '& .profile-image': {
          width: 160,
          height: 160,
          objectFit: 'cover',
          maxWidth: '100%',
          borderRadius: '50%'
        },
        '& .profile-details': {
          textAlign: 'center',
          '& span, svg': {
            verticalAlign: 'middle'
          },
          '& a': {
            color: '#00bcd4'
          }
        },
        '& hr': {
          border: 'none',
          margin: '0 0 10px 0'
        },
        '& svg.button': {
          '&:hover': {
            cursor: 'pointer'
          }
        }
      }
})

class Profile extends Component {

    handleImageChange = e => {
        const image = e.target.files[0]
        // NOTE FormFata() construct a set of key/value pairs
        const formData = new FormData()
        // NOTE append(name, value, fileName)
        formData.append('image', image, image.name)
        // NOTE uploadImage() is in userAction.js
        this.props.uploadImage(formData)
    }

    // NOTE when we click the icon it triggers this function, which will click the file uploading input we hide
    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput')
        fileInput.click() 
    }

    handleLogout = () => {
        this.props.logoutUser()
    }
    render() {
        // NOTE this loading is when the profile of the user is loading, which is different from the ui loading
        const { 
            classes, 
            user: { 
                credentials: { handle, createdAt, imageUrl, userDetails}, 
                authenticated,
                loading 
            } 
        } = this.props
        
        let profileMarkup = !loading ?  (authenticated ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className='image-wrapper'>
                    <img src={imageUrl} alt='profile' className='profile-image'/>
                    <input type='file' id='imageInput' onChange={this.handleImageChange} hidden='hidden'/>
                    <ToolTip title='Edit profile picture'>
                        <IconButton onClick={this.handleEditPicture} className='button'>
                            <EditIcon color='primary' />
                        </IconButton>
                    </ToolTip>

                </div>
                <hr/>
                <div className="profile-details">
                    <MuiLink component={Link} to={`/users/${handle}`} color='primary' variant='h5'>
                        @{handle}
                    </MuiLink>
                    <hr/>
                   {userDetails.bio && <Typography variant='body2'>{userDetails.bio}</Typography>}
                   <hr/>
                   {userDetails.location && (
                       // NOTE <Fragment> is to wrap elements to avoid error
                       <Fragment>
                           <LocationOn color='primary' /><span>{userDetails.location}</span>
                           <hr/>
                       </Fragment>
                    )}
                    {userDetails.website && (
                        <Fragment>
                             {/* NOTE _blank is used to let the web to open in a different window */}
                            <LinkIcon color='primary'/>
                             {/* NOTE to omit Referrer header
                             HIGHLIGHT Referer request header contains the address of the previous web page
                             NOTE The Referer header allows servers to identify where people are visiting them from 
                             NOTE and may use that data for analytics, logging, or optimized caching, for example.
                             NOTE should be avoided for security and privacy concerns
                             NOTE noopener instructs the browser to navigate to the target resource without granting 
                             NOTE the new browsing context access to the document that opened it — by not setting the Window.opener property on the opened window 
                             HIGHLIGHT noopener is especially useful when opening untrusted links */}
                            <a href={userDetails.website} target='_blank' rel='noopener noreferrer'>
                                {' '}{userDetails.website}
                            </a>
                            <hr/>
                        </Fragment>
                    )}
                    <CalendarToday color='primary'/>{' '}
                    <span>Joined {dayjs(createdAt).format('MM YYYY')}</ span>
                </div> {/** profile-details */}
                {/* NOTE <ToolTip> takes only one child */}
                <ToolTip title='Logout' placement='top'>
                    <IconButton onClick={this.handleLogout}>
                        <KeyboardReturn color='primary'/>
                    </IconButton>
                </ToolTip>
                <EditDetails />
            </div> {/** classes.profile */}
        </Paper>) 
        : (
           // when the user is not authenticated
            <Paper className={classes.paper}>
                <Typography variant='body2' align='center'>
                    No profile found, please login again.
                </Typography>
                <div className={classes.buttons}>
                    <Button variant='contained' color='primary' component={Link} to='/login'>Login</Button>
                    <Button variant='contained' color='secondary' component={Link} to='/signup'>Signup</Button>
                </div>
            </Paper>
        )) : <p>Loading...</p>
        return profileMarkup
    }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionToProps = {
    uploadImage,
    logoutUser
}

export default connect(
    mapStateToProps,
    mapActionToProps
)(withStyles(styles)(Profile))
