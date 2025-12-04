const express = require('express')
const router = express.Router()
const { db, auth } = require('../config/firebase')
const requireLogin = require('../middleware/requireLogin')

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dlvlyhpo7/image/upload/v1614182894/585e4bf3cb11b227491c339a_de90vh.png'

/**
 * Name: protected
 * Description: Validates if user is logged in
 * Return: error or successful message
 */
router.get('/protected', requireLogin, (req, res) => {
    res.send('hello user')
})

/**
 * Name: create-profile
 * Description: Creates user profile in Firestore after Firebase Auth signup
 * @req: Firebase ID token in Authorization header, name and optional image in body
 * Return: user data or error
 */
router.post('/create-profile', async (req, res) => {
    const { authorization } = req.headers
    if (!authorization || !authorization.startsWith('Bearer '))
        return res.status(401).json({ error: 'unauthorized' })

    const token = authorization.replace('Bearer ', '')

    try {
        const decodedToken = await auth.verifyIdToken(token)
        const uid = decodedToken.uid
        const email = decodedToken.email

        const { name, image } = req.body
        if (!name)
            return res.status(422).json({ error: 'name is required' })

        // Check if user already exists
        const userDoc = await db.collection('users').doc(uid).get()
        if (userDoc.exists)
            return res.status(422).json({ error: 'profile already exists' })

        // Create user profile
        const userData = {
            name,
            email,
            image: image || DEFAULT_IMAGE,
            followers: [],
            following: [],
            createdAt: new Date().toISOString()
        }

        await db.collection('users').doc(uid).set(userData)

        res.json({
            message: 'profile created successfully',
            user: { _id: uid, ...userData }
        })
    } catch (err) {
        console.error('Create profile error:', err)
        // Check if it's a Firestore "NOT_FOUND" error (database not created)
        if (err.code === 5 || err.message?.includes('NOT_FOUND')) {
            return res.status(503).json({ error: 'Database not available. Please create Firestore database in Firebase Console.' })
        }
        res.status(500).json({ error: 'failed to create profile' })
    }
})

/**
 * Name: get-profile
 * Description: Gets current user profile
 * Return: user data or error
 */
router.get('/get-profile', requireLogin, (req, res) => {
    const { _id, name, email, image, followers, following } = req.user
    res.json({ user: { _id, name, email, image, followers, following } })
})

module.exports = router
