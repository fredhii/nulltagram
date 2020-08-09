/* ==================================================== */
/* IMPORTS */
/* ==================================================== */
require('dotenv').config()
require('./models/user')
require('./models/post')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

/* ==================================================== */
/* MONGODB conection */
/* ==================================================== */
mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser : true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log('\x1b[36m%s\x1b[0m', 'Connected to Mongo', '\x1b[0m') // Color Cyan
})
mongoose.connection.on('error', (err) => {
    console.log(`unable to connect to Mongo ${err}`)
})

/* ==================================================== */
/* ROUTES */
/* ==================================================== */
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../ntagram/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'ntagram', 'build', 'index.html'))
    })
}

app.listen(process.env.PORT, () => {
    console.log(`\nServer is running on PORT ${process.env.PORT}`)
})
