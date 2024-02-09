const jwt = require('jsonwebtoken')


const generateRefreshToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: "2d"})
}

const sendCookie = (res,id) => {
    try {
        const refreshToken = generateRefreshToken(id)
    
        res.cookie('chatAppJWT', refreshToken , {
            httpOnly: true, 
            secure: true, 
            sameSite: 'None',
            maxAge:  2 * 24 * 60 * 60 * 1000,
        })
        
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
}


module.exports = { generateRefreshToken , sendCookie }