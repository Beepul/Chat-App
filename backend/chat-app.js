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
const path = require('path')




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

// ---------------------- Development -----------------

const __dirname1 = path.resolve(__dirname,'..')

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1, '/frontend/dist')))

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'dist', 'index.html'))
    })
}else{
    app.get('/', (req,res) => {
        res.send('API running successfully')
    })
}

// ---------------------- Development -----------------




app.use(errorHandler)

module.exports = app




