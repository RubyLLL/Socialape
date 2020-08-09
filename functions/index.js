const functions = require('firebase-functions');
const app = require('express')()

const { 
    getAllScreams, 
    postScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream
 } = require('./handlers/scream')
const { 
    userSignup, 
    userLogin, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser 
} = require('./handlers/user')
const FBAuth = require('./utils/fbAuth');

// srceam routes
app.get('/screams', getAllScreams)
// Post one scream
app.post('/scream', FBAuth, postScream)

app.get('/scream/:screamId', getScream)
app.post('/scream/:screamId/comments', FBAuth, commentOnScream)
app.get('/scream/:screamId/like',FBAuth, likeScream)
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
// TODO: deleteScream


// Sign up route
app.post('/signup', userSignup)
// Log in route
app.post('/login', userLogin)

app.post('/user/image',FBAuth, uploadImage)

app.post('/user', FBAuth, addUserDetails)

app.get('/user', FBAuth, getAuthenticatedUser)

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app)