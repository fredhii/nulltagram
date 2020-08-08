const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')



/**
 * Name: Get user info
 * Description: Gets user data
 * Return: error or successful message
 */
router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select('-password')
        .then( user => {
            Post.find({ postedBy: req.params.id })
                .populate('postedBy', '_id name')
                .exec(( err, posts ) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
    }).catch( err => {
        return res.status(404).json({ error: 'User not found' })
    })
})

/**
 * Name: Follow an user
 * Description: Insert follower to user
 * Return: error or successful message
 */
router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followerId, {
      $push: { followers: req.user._id }  
    }, {
        new: true
    }, ( err, result) => { if (err) { return res.status(422).json({ error: err }) }
    })
    User.findByIdAndUpdate(req.user._id, {
        $push: { following: req.body.followerId }  
      }, { new: true })
        .select('-password')
        .then( result => {
          res.json(result)
      }).catch( err => {
          return res.status(422).json({ error: err })
      })
})


/**
 * Name: Unfollow an user
 * Description: Remove user follower
 * Return: error or successful message
 */
router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followerId, {
      $pull: { followers: req.user._id }  
    }, {
        new: true
    }, ( err, result) => { if (err) { return res.status(422).json({ error: err }) }
    })
    User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.body.followerId }  
      }, { new: true })
        .select('-password')
        .then( result => {
          res.json(result)
      }).catch( err => {
          return res.status(422).json({ error: err })
      })
})

module.exports = router
