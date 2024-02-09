require('dotenv').config({
	path: 'config/.env'
});
const app = require('./chat-app')
const db = require('./config/db');
const configureSocket = require('./socket');
const http = require('http')


db.connectDB()

const httpServer = http.createServer(app)

const PORT = process.env.PORT || 3001

const server = httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})

configureSocket(httpServer)

// If any unhandled exceptions then we will shut down the server
process.on('unhandledRejection', (err) => {
	console.log(`Shutting down the server for ${err.message}`);
	console.log(`Shutting doen the server for unhandle promise rejection`);

	server.close(() => {
		process.exit(1);
	});
});
