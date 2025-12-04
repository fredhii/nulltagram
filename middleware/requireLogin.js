const { auth, db } = require('../config/firebase')

/* ======================================================= */
/* Middleware to require login (Firebase Auth) */
/* ======================================================= */
module.exports = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization || !authorization.startsWith('Bearer '))
        return res.status(401).json({ error: 'you must be logged in' })

    const token = authorization.replace('Bearer ', '')

    try {
        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(token)
        const uid = decodedToken.uid

        // Get user data from Firestore
        const userDoc = await db.collection('users').doc(uid).get()

        if (!userDoc.exists) {
            return res.status(401).json({ error: 'user not found' })
        }

        req.user = {
            _id: uid,
            ...userDoc.data()
        }
        next()
    } catch (err) {
        console.error('Auth error:', err)
        // Check if it's a Firestore "NOT_FOUND" error (database not created)
        if (err.code === 5 || err.message?.includes('NOT_FOUND')) {
            return res.status(503).json({ error: 'Database not available. Please create Firestore database in Firebase Console.' })
        }
        return res.status(401).json({ error: 'invalid or expired token' })
    }
}