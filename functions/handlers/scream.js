const { db } = require('../utils/admin')

exports.getAllScreams = (req, res) => {
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
    .catch(e => {
        console.error(e)
        res.status(500).json({ error: e.code })
    })
}

exports.postScream = (req, res) => {
    if(req.body.trim() === '') return res.status(400).json({ body: 'Must not be empty' })

    const newScream = {
        body: req.body.body,
        userHandle: req.user.userHandle,
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
}