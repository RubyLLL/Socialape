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
    // if(req.body.trim() === '') return res.status(400).json({ body: 'Must not be empty' })

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        imageUrl: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0
    };

    db
    .collection('screams')
    .add(newScream)
    .then((doc) => {
        const resScream = newScream
        resScream.screamId = doc.id
        res.json(resScream)
    })
    .catch(err => {
        res.status(500).json({ error: 'something went wrong' })
        console.log(err)
    })
}

exports.getScream = (req, res) => {
    let screamData = {}
    db
    .doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Scream not found' })
        }
        screamData = doc.data()
        screamData.screamId = doc.id
        return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('screamId', '==', req.params.screamId)
        .get()
    })
    .then(data => {
        screamData.comments = []
        data.forEach(doc => {
            screamData.comments.push(doc.data())
        })
        return res.json(screamData)
    })
    .catch(e => {
        console.error(e)
        return res.status(500).json({ error: e.code })
    })
}

exports.commentOnScream = (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty' })

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    }

    db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc => {
        if(!doc.exists) {
            return req.status(404).json({ error: 'Scream not found' })
        }
        return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
    })
    .then(() => {
        return db.collection('comments').add(newComment)
    })
    .then(() => {
        return res.json(newComment)
    })
    .catch(e => {
        console.error(e)
        return res.status(500).json({ error: e.code })
    })

} 

exports.likeScream = (req, res) => {
    const likeDocument = 
    db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1)

    const screamDocument = db.collection('screams').doc(req.params.screamId)

    let screamData = {}

    screamDocument.get()
    // get the scream the user wants to like
    .then(doc => {
        if(doc.exists) {
            screamData = doc.data()
            screamData.screamId = doc.id

            return likeDocument.get()
        } else return res.status(404).json({ error: 'Scream not found' })
    })
    // a query snapshot
    .then(data => {
        // this scream has not been liked by this user
        if(data.empty) {
            return db.collection('likes').add({
                // add this scream to likes
                screamId: req.params.screamId,
                userHandle: req.user.handle
            })
            .then(() => {
                // increase likeCount of this scream
                screamData.likeCount++
                return screamDocument.update({ likeCount: screamData.likeCount })
            })
            .then(() => {
                return res.json(screamData)
            })
        } else {
            // this scream has already been liked by this user
            return res.status(400).json({ error: 'Scream already liked' })
        }
    })
    .catch(e => {
        console.error(e)
        res.status(500).json({ error: e.code })
    })
     
}

exports.unlikeScream = (req, res) => {
    const likeDocument = 
    db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1)

    const screamDocument = db.collection('screams').doc(req.params.screamId)

    let screamData = {}

    screamDocument.get()
    // get the scream the user wants to like
    .then(doc => {
        if(doc.exists) {
            screamData = doc.data()
            screamData.screamId = doc.id

            return likeDocument.get()
        } else return res.status(404).json({ error: 'Scream not found' })
    })
    // a query snapshot
    .then(data => {
        if(data.empty) {
            return res.status(400).json({ error: 'Scream not liked' })
        } else {
            return db
            .doc(`/likes/${data.docs[0].id}`)
            .delete()
            .then(() => {
                screamData.likeCount--
                return screamDocument.update({ likeCount: screamData.likeCount })
            })
            .then(() => {
                return res.json(screamData)
            })
        }
    })
    .catch(e => {
        console.error(e)
        res.status(500).json({ error: e.code })
    })

}