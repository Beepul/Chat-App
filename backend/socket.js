const { Server } = require('socket.io')

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
        }
    })

    io.on('connection', (socket) => {
        console.log('connected to socket')

        socket.on('setup', (userData) => {
            socket.join(userData._id)
            socket.emit('connected')
        })

        socket.on('join__chat', (room) => {
            socket.join(room)
            console.log('User Joined Room:', room)
        })

        socket.on('typing', (room) => {
            socket.in(room).emit('typing')
        })

        socket.on('stop__typing', (room) => {
            socket.in(room).emit('stop__typing')
        })

        socket.on('send__message', (message) => {
            let chat = message.chat 
            if(!chat.users){
                return console.log('chat.users not defined')
            }
            chat.users.forEach(user => {
                if(user._id === message.sender._id){
                    return
                }else{
                    socket.in(user._id).emit('recieved__message', message)
                }
            })
        })

        socket.off('', () => {
            console.log('User Disconnected')
            socket.leave(userData._id)
        })
        
        socket.on('disconnect', (socket) => {
            console.log('disconnected')
        })
    })
}

module.exports = configureSocket