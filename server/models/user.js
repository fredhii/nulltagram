const mongoose = require('mongoose')

/* ======================================================= */
/* Model for users */
/* ======================================================= */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})

mongoose.model('User', userSchema)
