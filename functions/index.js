const functions = require('firebase-functions');
const admin = require('firebase-admin')
const firebase = require('firebase')
const app = require('express')()
const firebaseConfig = {
    apiKey: "AIzaSyA2YATyDKKDmICf1_WL1RdYUja0axXDvAM",
    authDomain: "socialape-51d2f.firebaseapp.com",
    databaseURL: "https://socialape-51d2f.firebaseio.com",
    projectId: "socialape-51d2f",
    storageBucket: "socialape-51d2f.appspot.com",
    messagingSenderId: "957547815035",
    appId: "1:957547815035:web:8ff2ea2815002c360f02de"
  };

admin.initializeApp({
    credential: admin.credential.cert(require('./admin.json'))
});

firebase.initializeApp(firebaseConfig);

const db = admin.firestore();



app.get('/screams', (req, res) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                ...doc.data()
            })
        });

        return res.json(screams);
    })
    .catch(e => console.error(e))
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
    .collection('screams')
    .add(newScream)
    .then((doc) => {
        res.json({ message: `document ${doc.id} created successfully.`})
    })
    .catch(err => {
        res.status(500).json({ error: 'something went wrong' })
        console.log(err)
    })
});

// Sign up route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandle: req.body.userHandle

    };

    // TODO: validate data
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
})

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app)