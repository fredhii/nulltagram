const express = require('express')
const router = express.Router()
const { db } = require('../config/firebase')
const requireLogin = require('../middleware/requireLogin')
const { FieldValue } = require('firebase-admin/firestore')

// Helper to get user data
const getUserData = async (userId) => {
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) return null
    return { _id: userId, ...userDoc.data() }
}

// Helper to populate post with user data
const populatePost = async (postDoc) => {
    const post = { _id: postDoc.id, ...postDoc.data() }
    if (post.postedBy) {
        const userData = await getUserData(post.postedBy)
        post.postedBy = userData ? { _id: userData._id, name: userData.name } : null
    }
    return post
}

/**
 * Name: Search users
 * Description: Search users by name
 * Return: array of matching users
 */
router.get('/search-users', requireLogin, async (req, res) => {
    try {
        const query = req.query.q?.toLowerCase() || ''
        if (!query || query.length < 2) {
            return res.json({ users: [] })
        }

        // Firestore doesn't support full-text search, so we fetch and filter
        // For production, consider Algolia or Elasticsearch
        const snapshot = await db.collection('users').limit(50).get()

        const users = snapshot.docs
            .map(doc => ({ _id: doc.id, ...doc.data() }))
            .filter(user => user.name?.toLowerCase().includes(query))
            .slice(0, 10)
            .map(({ _id, name, image }) => ({ _id, name, image }))

        res.json({ users })
    } catch (err) {
        console.error('Search users error:', err)
        res.status(500).json({ error: 'failed to search users' })
    }
})

/**
 * Name: Get user info
 * Description: Gets user data and their posts
 * Return: error or user data with posts
 */
router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.params.id).get()

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' })
        }

        const user = { _id: req.params.id, ...userDoc.data() }

        // Get user's posts
        const postsSnapshot = await db.collection('posts')
            .where('postedBy', '==', req.params.id)
            .orderBy('createdAt', 'desc')
            .get()

        const posts = await Promise.all(
            postsSnapshot.docs.map(doc => populatePost(doc))
        )

        res.json({ user, posts })
    } catch (err) {
        console.error('Get user error:', err)
        res.status(500).json({ error: 'failed to get user' })
    }
})

/**
 * Name: Follow a user
 * Description: Insert follower to user
 * Return: error or updated user data
 */
router.put('/follow', requireLogin, async (req, res) => {
    try {
        const followerId = req.body.followerId
        const currentUserId = req.user._id

        // Add current user to target's followers
        await db.collection('users').doc(followerId).update({
            followers: FieldValue.arrayUnion(currentUserId)
        })

        // Add target to current user's following
        await db.collection('users').doc(currentUserId).update({
            following: FieldValue.arrayUnion(followerId)
        })

        const updatedUser = await getUserData(currentUserId)
        res.json(updatedUser)
    } catch (err) {
        console.error('Follow error:', err)
        res.status(422).json({ error: 'failed to follow user' })
    }
})

/**
 * Name: unfollow
 * Description: Remove user follower
 * Return: error or updated user data
 */
router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const followerId = req.body.followerId
        const currentUserId = req.user._id

        // Remove current user from target's followers
        await db.collection('users').doc(followerId).update({
            followers: FieldValue.arrayRemove(currentUserId)
        })

        // Remove target from current user's following
        await db.collection('users').doc(currentUserId).update({
            following: FieldValue.arrayRemove(followerId)
        })

        const updatedUser = await getUserData(currentUserId)
        res.json(updatedUser)
    } catch (err) {
        console.error('Unfollow error:', err)
        res.status(422).json({ error: 'failed to unfollow user' })
    }
})

/**
 * Name: update-profile
 * Description: Update user profile (name, bio)
 * Return: error or updated user data
 */
router.put('/update-profile', requireLogin, async (req, res) => {
    try {
        const { name, bio } = req.body
        const updates = {}

        if (name && name.trim()) {
            updates.name = name.trim()
        }
        if (bio !== undefined) {
            updates.bio = bio.trim()
        }

        if (Object.keys(updates).length === 0) {
            return res.status(422).json({ error: 'no valid fields to update' })
        }

        await db.collection('users').doc(req.user._id).update(updates)

        const updatedUser = await getUserData(req.user._id)
        res.json(updatedUser)
    } catch (err) {
        console.error('Update profile error:', err)
        res.status(422).json({ error: 'failed to update profile' })
    }
})

/**
 * Name: update-profile-image
 * Description: Update user profile image
 * Return: error or updated user data
 */
router.put('/update-profile-image', requireLogin, async (req, res) => {
    try {
        await db.collection('users').doc(req.user._id).update({
            image: req.body.image
        })

        const updatedUser = await getUserData(req.user._id)
        res.json(updatedUser)
    } catch (err) {
        console.error('Update image error:', err)
        res.status(422).json({ error: 'failed to update image' })
    }
})

module.exports = router
