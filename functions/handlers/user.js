const firebase = require('firebase')

const config = require('../utils/config')
firebase.initializeApp(config)

const { db, admin } = require('../utils/admin')
const { 
    validateSignupData, 
    validateLoginData,
    reduceUserDetails
 } = require('../utils/validator')

exports.userSignup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    // Validate the user
    console.log(newUser.handle)
    const { valid, errors } = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)

    const noImage = 'no-img.png'

    let userToken, userID
    db
    .collection('users')
    .where('userHandle', '==', newUser.handle)
    .limit(1)
    .get()
    .then(doc => {
        // this handle is already taken
        if(doc.exists) {
            return res.status(400).json({ handle: 'this handle is already taken' })
        } else {
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password) // register this new user
        }
    })
    .then(data => {
        userID = data.user.uid
        return data.user.getIdToken() // get the token of this user this returns a promise
    })
    .then(token => {
        userToken = token
        return db.collection("users").doc(`${userID}`).set({
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId: userID,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`
        }) // add this to the users collection
    })
    .then(() => {
        return res.status(201).json({ userToken })
    })
    .catch(e => {
        console.error(e)
        if(e.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'Email is already in use'})
        } else {
            return res.status(500).json({ error: 'Something wen wrong. Please try again.' })
        }
    })
}

exports.userLogin = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    // Validate user login
    const { valid, errors } = validateLoginData(user)
    if(!valid) return res.status(400).json(errors)

    // login the user
    firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken()
    })
    .then(token => {
        return res.json({token})
    })
    .catch(e => {
        console.error(e)
        return res.status(403).json({ general: 'Wrong credentials, pleae try again' })
    })
}

// Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body)

    db.collection('users').doc(`${req.user.uid}`).update({userDetails})
    .then(() => {
        return res.json({ message: 'Details added successfully' })
    })
    .catch(e => {
        console.error(e)
        return res.status(500).json({ error: e.code })
    })
}

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {}
    console.log(req.user)

    db
    .collection('users')
    .doc(`${req.user.id}`)
    .get()
    .then(doc => {
        console.log('is it?')
        if(doc.exists){
            console.log('it runs')
            userData.credentials = doc.data()
            // get the user's likes
            console.log(req.user.handle)
            return db
            .collection("likes")
            .where('handle', '==', req.user.handle)
            .get()
        }
    })
    .then((data) => {
        if(data.length !== 0){
            userData.likes = []
            data.forEach(doc => {
                userData.likes.push(doc.data())
            })
        }
        // get the user's notifications
        return db.collection('notifications').where('recipient', '==', req.user.handle).orderBy('createdAt', 'desc').limit(10).get()
    })
    .then(data => {
        userData.notifications = []
        data.forEach(doc => {
            userData.notifications.push({
                recipient: doc.data().recipient,
                sender: doc.data().sender,
                read: doc.data().read,
                type: doc.data().type,
                createdAt: doc.data().createdAt,
                screamId: doc.data().screamId,
                notificationId: doc.id
            })
        })
        return res.json(userData)
    })
    .catch(e => {
        console.error(e)
        return res.status(500).json({ error: e.code })
    })
}

// Upload user image
exports.uploadImage = (req, res) => {

    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName
    let imageToBeUploaded = {}

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(mimetype)
        if(mimetype !== "image/jpeg" && mimetype !== "image/png" && mimetype !== 'image/jpg'){
            return res.status(400).json({ error: 'Wrong file type submitted' })
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1]
        imageFileName = `${Math.floor(Math.random() * 1000000000000)}.${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFileName)

        imageToBeUploaded = { filepath, mimetype }
        file.pipe(fs.createWriteStream(filepath))
    })

    busboy.on("finish", () => {
        admin
          .storage()
          .bucket()
          .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype
                //Generate token to be appended to imageUrl
              }
            }
          })
          .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.collection('users').doc(`${req.user.uid}`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully' })
        })
        .catch(e => {
            console.error((e))
            return res.status(500).json({ error: e })
        })
    })
    busboy.end(req.rawBody)
}

exports.getUserDetails = (req, res) => {
    let userData = {}
    db
    .collection('users')
    .doc(req.params.id)
    .get()
    .then(doc => {
        if(doc.exists) {
            userData.user = doc.data()
            return db
            .collection('screams')
            .where('userId', '==', req.params.id)
            .orderBy('createdAt', 'desc')
            .get()  
        } else {
            return res.status(404).json({ error: 'User not found' })
        }
    })
    .then(data => {
        userData.screams = []
        data.forEach(doc => {
            userData.screams.push({
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                imageUrl: doc.data().imageUrl,
                userId: doc.data().userId,
                userHanlde: doc.data().userHanlde,
                screamId: doc.id
            })
        })
        return res.json(userData)
    })
    .catch(e => {
        console.error(e)
        return res.status(500).json({ error: e.code })
    })
    
}

exports.markNotificationRead = (req, res) => {
    // send serve an array of ids of unread notif
    // batch write -  in firebase when you need to modify multiple documents
    let batch = db.batch()
    req.body.forEach(notifId => {
        const notif = db.collection('notifications').doc(notifId)
        batch.update(notif, { read: true })
    })
    batch.commit()
    .then(() => {
        return res.json({ message: 'Notifications marked read' })
    })
    .catch(e => {
        console.error(e)
        return res.status(500).json({ error: e.code })
    })
}