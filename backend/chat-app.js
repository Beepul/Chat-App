const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const errorHandler = require('./middleware/error')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const fileUpload = require('express-fileupload')
const cloudinaryConfig = require('./config/cloudinary')




const app = express()
// const chatServer = http.createServer(app)


app.use(express.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles: true
}))

app.use(cloudinaryConfig)

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/message', messageRoutes)


app.get('/test', (req,res) => {
    res.send('Working')
})

app.use(errorHandler)

// const io = new Server(chatServer,{
//     pingTimeout: 60000,
//     cors: {
//         origin: 'http://localhost:5173',
//         methods: ['GET','POST']
//     }
// })

// NodeJS server
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`)

//     socket.on('join_room', (roomId) => {
//         socket.join(roomId)
//         console.log(`User with ID: ${socket.id} joined room: ${roomId}`)
//     })

//     socket.on('send_message', (data) => {
//         console.log('User rooms:', socket.rooms)
//         // console.log("her",data)
//         socket.to(data.chat._id).emit('receive_message', data)
//     })

//     socket.on('disconnect', () => {
//         console.log('User Disconnected', socket.id)
//     })
// })

module.exports = app




