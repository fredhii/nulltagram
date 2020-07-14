const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

/**
 * Name: allpost
 * Description: Get all post
 * Return: error or successful message
 */
router.get('/allposts', (req, res) => {
    Post.find()
    .populate('postedBy', '_id name')
    .then( posts => {
        res.json({ posts })
    })
    .catch( err => {
        console.log(err)
    })
})

/**
 * Name: createpost
 * Description: Validates if user is logged in
 * Return: error or json with post data
 */
router.post('/createpost', requiredLogin, (req, res) => {
    const { title, body, url } = req.body
    if ( !title || !body || !url)
        return res.status(422).json({ error: 'Please insert all the fields' })

    req.user.password = null
    const post = new Post({
        title,
        body,
        url,
        postedBy: req. user
    })
    post.save()
    .then( result => {
        return res.json({ post: result })
    })
    .catch( err => {
        console.log(err)
    })
})


/**
 * Name: mypost
 * Description: Get a post
 * @req: user id
 * Return: error or successful message
 */
router.get('/mypost', requiredLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
    .populate( 'postedBy', '_id name' )
    .then( mypost => {
        res.json({ mypost })
    })
    .catch( err => {
        console.log(err)
    })
})

module.exports = router
