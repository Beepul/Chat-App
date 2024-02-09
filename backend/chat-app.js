require('dotenv').config();
const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/error')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const fileUpload = require('express-fileupload')
const cloudinaryConfig = require('./config/cloudinary')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

// app server
const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())

app.use(morgan('tiny'))

app.use(fileUpload({
    useTempFiles: true
}))

app.use(cloudinaryConfig)

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/message', messageRoutes)

app.use('/',(req,res) => {
    res.send('Rapid Chat')
})

app.use(errorHandler)

module.exports = app




