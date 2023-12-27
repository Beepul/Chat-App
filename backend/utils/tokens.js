const jwt = require('jsonwebtoken')


const generateRefreshToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: "2d"})
}

const sendCookie = (res,id) => {

    const refreshToken = generateRefreshToken(id)

    res.cookie('jwt', refreshToken , {
        httpOnly: true, 
        secure: true, 
        sameSite: 'None',
        maxAge:  2 * 24 * 60 * 60 * 1000,
    })
}


module.exports = { generateRefreshToken , sendCookie }