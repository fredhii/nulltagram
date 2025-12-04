const express = require('express')
const router = express.Router()
const { db } = require('../config/firebase')
const requireLogin = require('../middleware/requireLogin')
const { FieldValue } = require('firebase-admin/firestore')

// Helper to get user data for populating
const getUserData = async (userId) => {
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) return null
    const data = userDoc.data()
    return { _id: userId, name: data.name, image: data.image }
}

// Helper to populate post with user data
const populatePost = async (postDoc) => {
    const post = { _id: postDoc.id, ...postDoc.data() }

    // Populate postedBy
    if (post.postedBy) {
        post.postedBy = await getUserData(post.postedBy)
    }

    // Populate comments
    if (post.comments && post.comments.length > 0) {
        post.comments = await Promise.all(
            post.comments.map(async (comment) => ({
                ...comment,
                postedBy: await getUserData(comment.postedBy)
            }))
        )
    }

    return post
}

/**
 * Name: allpost
 * Description: Get all posts with pagination
 * Query params: limit (default 10), cursor (post ID to start after)
 * Return: error or { posts, nextCursor, hasMore }
 */
router.get('/allposts', requireLogin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const cursor = req.query.cursor

        let query = db.collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(limit + 1) // Fetch one extra to check if there's more

        // If cursor provided, start after that document
        if (cursor) {
            const cursorDoc = await db.collection('posts').doc(cursor).get()
            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc)
            }
        }

        const snapshot = await query.get()
        const docs = snapshot.docs

        // Check if there are more posts
        const hasMore = docs.length > limit
        const postsToReturn = hasMore ? docs.slice(0, limit) : docs

        const posts = await Promise.all(
            postsToReturn.map(doc => populatePost(doc))
        )

        // Next cursor is the last post's ID
        const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null

        res.json({ posts, nextCursor, hasMore })
    } catch (err) {
        console.error('Get posts error:', err)
        res.status(500).json({ error: 'failed to get posts' })
    }
})

/**
 * Name: explore
 * Description: Get posts for explore page (shuffled)
 * Return: error or posts array
 */
router.get('/explore', requireLogin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20

        // Get recent posts (last 100), then shuffle
        const snapshot = await db.collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get()

        let posts = await Promise.all(
            snapshot.docs.map(doc => populatePost(doc))
        )

        // Shuffle the posts for variety
        posts = posts.sort(() => Math.random() - 0.5).slice(0, limit)

        res.json({ posts })
    } catch (err) {
        console.error('Explore error:', err)
        res.status(500).json({ error: 'failed to get explore posts' })
    }
})

/**
 * Name: getpost
 * Description: Get a single post by ID
 * Return: error or post data
 */
router.get('/post/:id', requireLogin, async (req, res) => {
    try {
        const postDoc = await db.collection('posts').doc(req.params.id).get()

        if (!postDoc.exists) {
            return res.status(404).json({ error: 'Post not found' })
        }

        const post = await populatePost(postDoc)
        res.json({ post })
    } catch (err) {
        console.error('Get post error:', err)
        res.status(500).json({ error: 'failed to get post' })
    }
})

/**
 * Name: createpost
 * Description: Creates a new post
 * Return: error or json with post data
 */
router.post('/createpost', requireLogin, async (req, res) => {
    const { title, body, url } = req.body
    if (!title || !body || !url)
        return res.status(422).json({ error: 'Please insert all the fields' })

    try {
        const postData = {
            title,
            body,
            picture: url,
            postedBy: req.user._id,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString()
        }

        const docRef = await db.collection('posts').add(postData)
        const post = await populatePost(await docRef.get())

        res.json({ post })
    } catch (err) {
        console.error('Create post error:', err)
        res.status(500).json({ error: 'failed to create post' })
    }
})

/**
 * Name: mypost
 * Description: Get all user posts
 * Return: error or posts array
 */
router.get('/mypost', requireLogin, async (req, res) => {
    try {
        const snapshot = await db.collection('posts')
            .where('postedBy', '==', req.user._id)
            .orderBy('createdAt', 'desc')
            .get()

        const mypost = await Promise.all(
            snapshot.docs.map(doc => populatePost(doc))
        )

        res.json({ mypost })
    } catch (err) {
        console.error('Get my posts error:', err)
        res.status(500).json({ error: 'failed to get posts' })
    }
})

/**
 * Name: givelike
 * Description: Adds a like to a post
 * Return: error or updated post
 */
router.put('/givelike', requireLogin, async (req, res) => {
    try {
        const postRef = db.collection('posts').doc(req.body.postId)
        await postRef.update({
            likes: FieldValue.arrayUnion(req.user._id)
        })

        const post = await populatePost(await postRef.get())
        res.json(post)
    } catch (err) {
        console.error('Like error:', err)
        res.status(422).json({ error: 'failed to like post' })
    }
})

/**
 * Name: removelike
 * Description: Removes a like from a post
 * Return: error or updated post
 */
router.put('/removelike', requireLogin, async (req, res) => {
    try {
        const postRef = db.collection('posts').doc(req.body.postId)
        await postRef.update({
            likes: FieldValue.arrayRemove(req.user._id)
        })

        const post = await populatePost(await postRef.get())
        res.json(post)
    } catch (err) {
        console.error('Unlike error:', err)
        res.status(422).json({ error: 'failed to unlike post' })
    }
})

/**
 * Name: insert-comment
 * Description: Inserts a comment in a post
 * Return: error or updated post
 */
router.put('/insert-comment', requireLogin, async (req, res) => {
    try {
        const comment = {
            text: req.body.text,
            postedBy: req.user._id,
            createdAt: new Date().toISOString()
        }

        const postRef = db.collection('posts').doc(req.body.postId)
        await postRef.update({
            comments: FieldValue.arrayUnion(comment)
        })

        const post = await populatePost(await postRef.get())
        res.json(post)
    } catch (err) {
        console.error('Comment error:', err)
        res.status(422).json({ error: 'failed to add comment' })
    }
})

/**
 * Name: delete-comment
 * Description: Deletes a comment from a post
 * Return: error or updated post
 */
router.delete('/delete-comment/:postId/:commentIndex', requireLogin, async (req, res) => {
    try {
        const postRef = db.collection('posts').doc(req.params.postId)
        const postDoc = await postRef.get()

        if (!postDoc.exists) {
            return res.status(404).json({ error: 'post not found' })
        }

        const postData = postDoc.data()
        const commentIndex = parseInt(req.params.commentIndex)
        const comment = postData.comments[commentIndex]

        if (!comment) {
            return res.status(404).json({ error: 'comment not found' })
        }

        // Only comment author or post owner can delete
        if (comment.postedBy !== req.user._id && postData.postedBy !== req.user._id) {
            return res.status(403).json({ error: 'not authorized' })
        }

        // Remove the comment
        const updatedComments = postData.comments.filter((_, idx) => idx !== commentIndex)
        await postRef.update({ comments: updatedComments })

        const post = await populatePost(await postRef.get())
        res.json(post)
    } catch (err) {
        console.error('Delete comment error:', err)
        res.status(422).json({ error: 'failed to delete comment' })
    }
})

/**
 * Name: delete-post
 * Description: Deletes a post
 * Return: error or deleted post data
 */
router.delete('/delete-post/:postId', requireLogin, async (req, res) => {
    try {
        const postRef = db.collection('posts').doc(req.params.postId)
        const postDoc = await postRef.get()

        if (!postDoc.exists) {
            return res.status(404).json({ error: 'post not found' })
        }

        const postData = postDoc.data()
        if (postData.postedBy !== req.user._id) {
            return res.status(403).json({ error: 'not authorized' })
        }

        await postRef.delete()
        res.json({ _id: req.params.postId, ...postData })
    } catch (err) {
        console.error('Delete post error:', err)
        res.status(422).json({ error: 'failed to delete post' })
    }
})

module.exports = router
