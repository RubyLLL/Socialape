const firebase = require('firebase')

const config = require('../utils/config')
firebase.initializeApp(config)

const { db, admin } = require('../utils/admin')
const { 
    validateSignupData, 
    validateLoginData
 } = require('../utils/validator')

exports.userSignup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    // Validate the user
    const { valid, errors } = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)

    const noImage = 'no-img.png'

    let userToken, userID
    db
    .doc(`/users/${newUser.handle}`).get()
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
            return res.status(500).json({ error: e.code })
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
        if(e.code === 'auth/wrong-password') return res.status(403).json({ general: 'Wrong credentials, pleae try again' })
        else return res.status(500).json({ error: e.code })
    })
}

exports.uploadImage = (req, res) => {

    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName
    let imageToBeUploaded = {}

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname)
        console.log(filename)
        console.log(mimetype)
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
            console.log(req.user)
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
