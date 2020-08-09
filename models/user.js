const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

/* ======================================================= */
/* Model for users */
/* ======================================================= */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, default: 'https://res.cloudinary.com/dlvlyhpo7/image/upload/v1596919116/user_circle_1048392_vrei5t.png' },
    followers: [{ type: ObjectId, ref: 'User' }],
    following: [{ type: ObjectId, ref: 'User' }]
})

mongoose.model('User', userSchema)
