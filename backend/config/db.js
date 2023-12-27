const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const data = await mongoose.connect(process.env.DB_URI)
        console.log(`mongodb connected with server: ${data.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connectDB }