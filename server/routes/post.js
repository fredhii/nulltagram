const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

/**
 * Name: allpost
 * Description: Get all post
 * Return: error or successful message
 */
router.get('/allposts', requireLogin, (req, res) => {
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
router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, url } = req.body
    if ( !title || !body || !url)
        return res.status(422).json({ error: 'Please insert all the fields' })

    req.user.password = null
    const post = new Post({
        title,
        body,
        picture: url,
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
router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
    .populate( 'postedBy', '_id name' )
    .then( mypost => {
        res.json({ mypost })
    })
    .catch( err => {
        console.log(err)
    })
})

/**
 * Name: givelike
 * Description: Adds a like in a post image
 * Return: error or successful message
 */
router.put('/givelike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{ likes: req.user._id }
    }, {
        new: true
    }).exec(( err, result ) => {
        if (err) {
            return res.status(422).json({  error: err })
        } else {
            res.json(result)
        }
    })
})

/**
 * Name: removelike
 * Description: Removes a like in a post image
 * Return: error or successful message
 */
router.put('/removelike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{ likes: req.user._id }
    }, {
        new: true
    }).exec(( err, result ) => {
        if (err) {
            return res.status(422).json({  error: err })
        } else {
            res.json(result)
        }
    })
})

module.exports = router
