const functions = require('firebase-functions');
const app = require('express')()

const {db } = require('./utils/admin')
const { 
    getAllScreams, 
    postScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
 } = require('./handlers/scream')
const { 
    userSignup, 
    userLogin, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser ,
    getUserDetails,
    markNotificationRead
} = require('./handlers/user')
const FBAuth = require('./utils/fbAuth');
const fbAuth = require('./utils/fbAuth');

// srceam routes
app.get('/screams', getAllScreams)
// Post one scream
app.post('/scream', FBAuth, postScream)

app.get('/scream/:screamId', getScream)
app.post('/scream/:screamId/comments', FBAuth, commentOnScream)
app.get('/scream/:screamId/like',FBAuth, likeScream)
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
app.delete('/scream/:screamId', FBAuth, deleteScream)


// Sign up route
app.post('/signup', userSignup)
// Log in route
app.post('/login', userLogin)
app.post('/user/image',FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)
app.get('/user/:id', getUserDetails)
app.post('/notifications', fbAuth, markNotificationRead)

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app)

// database trigger
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
.onCreate((snapshot) => {
    db.doc(`screams/${snapshot.data().screamId}`).get()
    .then(doc => {
        if(doc.exists) {
            return db.doc(`notifications/${snapshot.id}`).add({
                createdAt: new Date().toISOString(), 
                recipient: doc.data().userHandle,
                sender:snapshot.data().userHandle,
                type: 'like',
                read: false,
                screamId: doc.id
            })
        }
    })
    .then(() => {
        return
    })
    .catch(e => {
        console.error(e)
        return
    }) 
})

exports.deleteNotificationOnLike = functions.firestore.document('likes/{id}')
.onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .then(() => {
        return
    })
    .catch(e => {
        console.error(e)
        return
    })
})

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
.onCreate((snapshot) => {
    db.doc(`screams/${snapshot.data().screamId}`).get()
    .then(doc => {
        if(doc.exists) {
            return db.doc(`notifications/${snapshot.id}`).add({
                createdAt: new Date().toISOString(), 
                recipient: doc.data().userHandle,
                sender:snapshot.data().userHandle,
                type: 'comment',
                read: false,
                screamId: doc.id
            })
        }
    })
    .then(() => {
        return
    })
    .catch(e => {
        console.error(e)
        return
    })
})