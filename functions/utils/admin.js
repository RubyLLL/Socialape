const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert(require('../admin.json')),
    storageBucket: "socialape-51d2f.appspot.com"
})

const db = admin.firestore()

module.exports = {
    admin, 
    db
}