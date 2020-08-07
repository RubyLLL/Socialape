const { db, admin } = require('./admin')

module.exports = (req, res, next) => {
        let idToken
        // A good practice is to start your token with 'Bearer '
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            idToken = req.headers.authorization.split('Bearer ')[1] // take the string after Bearer 
        } else {
            console.error('No token found');
            return res.status(403).json({ error: 'Unauthorized' })
        }
    
        // make sure the token is from our application, not somewhere else
        // then add data into the req, so when req proceeds forward we can use token to check auth
        admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken
            return db.collection('users')
            .where('userId', '==', req.user.uid)
            .limit(1)
            .get() // get the data with corresponding user id
        })
        .then(data => {
            // data() will extract data from the document
            req.user.handle = data.docs[0].data().handle
            return next()
        })
        .catch(e => {
            console.error('Error while verifying token ', e);
            return res.status(403).json(e)
        })
    }