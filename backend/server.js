require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database')

        app.listen(process.env.PORT, () => {
            console.log('listening for requests on port', process.env.PORT)
        })
    })
        .catch((err) => {
            console.log(err)
        })
    