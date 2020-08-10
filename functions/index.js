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
app.post('/notifications', FBAuth, markNotificationRead)

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app)

// database trigger
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
.onCreate((snapshot) => {
    return db.doc(`screams/${snapshot.data().screamId}`).get()
    .then(doc => {
        if(doc.exists && doc.data().userId !== snapshot.data().userId) {
            return db.doc(`notifications/${snapshot.id}`).add({
                createdAt: new Date().toISOString(), 
                recipient: doc.data().userId,
                sender:snapshot.data().userId,
                type: 'like',
                read: false,
                screamId: doc.id
            })
        }
    })
    .catch(e => console.error(e)) 
})

exports.deleteNotificationOnLike = functions.firestore.document('likes/{id}')
.onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch(e => console.error(e))
})

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
.onCreate((snapshot) => {
    return db.doc(`screams/${snapshot.data().screamId}`).get()
    .then(doc => {
        if(doc.exists && doc.data().userId !== snapshot.data().userId) {
            return db.doc(`notifications/${snapshot.id}`).add({
                createdAt: new Date().toISOString(), 
                recipient: doc.data().userId,
                sender:snapshot.data().userId,
                type: 'comment',
                read: false,
                screamId: doc.id
            })
        }
    })
    .catch(e => console.error(e))
})

// when user changes the profile picture, it will change on all screen
exports.onUserImageChange = functions.firestore.document('/users/{userId}')
.onUpdate((change) => {
    console.log(change.before.data())
    console.log(change.after.data())

    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
        console.log('image has changed')
        const batch = db.batch()
        return db.collection('screams').where('userHandle', '==', change.before.data().handle).get()
        .then(data => {
            data.forEach(doc => {
                const scream = db.doc(`/screams/${doc.id}`)
                batch.update(scream, { imageUrl: change.after.data().imageUrl })
            })
            return batch.commit()
        })
    }
})

exports.onScreamDelete = functions.firestore.document('/screams/{screamId}')
// in context has the params.url
.onDelete((snapshot, context) => {
    const screamId = context.params.screamId
    const batch = db.batch()
    return db.collection('comments').where('screamId', '==', screamId).get()
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('screamId', '==', screamId).get()
    })
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db.collection('notifications').where('screamId', '==', screamId).get()
    })
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit()
    })
    .catch(e => console.error(e)
    )
})