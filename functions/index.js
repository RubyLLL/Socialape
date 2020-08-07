const functions = require('firebase-functions');
const app = require('express')()

const { getAllScreams, postScream } = require('./handlers/scream')
const { userSignup, userLogin, uploadImage, addUserDetails } = require('./handlers/user')
const FBAuth = require('./utils/fbAuth');
const fbAuth = require('./utils/fbAuth');

// srceam routes
app.get('/screams', getAllScreams)
// Post one scream
app.post('/scream', FBAuth, postScream)

// Sign up route
app.post('/signup', userSignup)
// Log in route
app.post('/login', userLogin)

app.post('/user/image',FBAuth, uploadImage)

app.post('/user', fbAuth, addUserDetails)

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app)