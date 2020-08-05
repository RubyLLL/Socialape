const firebase = require('firebase')

const { config } = require('../utils/config')
firebase.initializeApp(config)

const { db } = require('../utils/admin')
const { 
    validateSignupData, 
    validateLoginData
 } = require('../utils/validator')

exports.userSignup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandle: req.body.userHandle
    };

    // Validate the user
    const { valid, errors } = validateSignupData(newUser)
    if(!valid) return res.status(400).json(errors)

    let userToken, userID
    db
    .doc(`/users/${newUser.userHandle}`).get()
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
        const userCredential = {
            userHandle: newUser.userHandle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId: userID
        }
        return db.collection("users").add(userCredential) // add this to the users collection
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
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
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