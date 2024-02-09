const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const BMError = require('../utils/error');

const protect = async (req, res, next) => {
	// console.log('hello')
	const header = req.headers.authorization || req.headers.Authorization;

	if (!header || !header.startsWith('Bearer ')) {
		return next(new BMError(403, 'Please login to continue'));
	}

	const token = header.split(' ')[1];

	if (!token) {
		return next(new BMError(403, 'You are not allowed to access'));
	}

	// console.log(token);
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(decodedToken)
		req.user = await User.findById(decodedToken.id).select('-password');
		next();
	} catch (error) {
		// console.log("here",error);
		return next(new BMError(401, error.message));
	}
};

module.exports = { protect };
