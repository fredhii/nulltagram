/* ==================================================== */
/* IMPORTS */
/* ==================================================== */
require('dotenv').config()
require('./config/firebase') // Initialize Firebase
const express = require('express')
const { apiReference } = require('@scalar/express-api-reference')
const openApiSpec = require('./config/openapi')
const app = express()

/* ==================================================== */
/* ROUTES */
/* ==================================================== */
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

/* ==================================================== */
/* API DOCUMENTATION */
/* ==================================================== */
app.get('/openapi.json', (req, res) => res.json(openApiSpec))
app.use('/docs', apiReference({ spec: { content: openApiSpec } }))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('ntagram/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'ntagram', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `Server running on PORT ${PORT}`)
    console.log('\x1b[36m%s\x1b[0m', 'Connected to Firebase')
})
