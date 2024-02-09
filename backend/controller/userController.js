const asyncHandler = require('../middleware/asyncHandler')
const User = require('../model/userModel')
const { imageUploader } = require('../utils/cloudinary')
const BMError = require('../utils/error')
const { sendCookie, generateRefreshToken } = require('../utils/tokens')
const jwt = require('jsonwebtoken')


//@description     Upload Image
//@route           POST /api/user/upload-img
//@access          Public
const uploadImage = asyncHandler(async (req, res) => {
    try {
        if(req.files === undefined) {
            throw new BMError(400, 'Please select an image!')
        }
        const image = req.files?.pic 
        
        if(!image){
            throw new BMError(400,'Please select an image')
        }

        const uploadedImage = await imageUploader(res , image, 'Chat_Profile')

        if(!uploadedImage){
            throw new BMError(400, 'Failed to upload image')
        }

        res.status(200).json({
            image: {
                url: uploadedImage.url
            }
        })
        
    } catch (error) {
        throw new BMError(400, error.message)
    }
})

//@description     Register new user
//@route           POST /api/user/
//@access          Public

const registerUser = asyncHandler(async (req,res,next) => {
    const {name, email, password, pic} = req.body

    if(!name || !email || !password ){
        throw new BMError(400, 'Please enter all the feilds')
    }

    const userExist = await User.findOne({email})

    if(userExist){
        throw next(new BMError(409, 'User already exists'))
    }

    const user = await User.create({name,email,password,pic})

    const finalUser = await User.findById(user._id).select('-password')

    res.status(201).json({
        success: true,
        user: finalUser
    })
})

//@description     Login the user
//@route           POST /api/users/login
//@access          Public

const loginUser = asyncHandler(async (req,res,next) => {
    const { email , password} = req.body 

    if(!email || !password){
        throw new BMError(400, 'Please enter all the feilds')
    }

    const user = await User.findOne({ email })

 
    if(!user){
        throw new BMError(404, 'User not found')
    }

    const isCorrectPassword = await user.matchPassword(password)

    if(!isCorrectPassword){
        throw new BMError(400, 'Invalid email or password')
    }

    sendCookie(res, user._id)
    

    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: user.generateAccessToken(user._id)
        }
    })
})

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public

const allUser = asyncHandler(async (req,res,next) => {

    const keyword = req.query.search ? {
        $or: [
            {name:{ $regex: req.query.search, $options: 'i'}},
            {email:{ $regex: req.query.search, $options: 'i'}}
        ]
    } : {}

    const users = await User.find({
        ...keyword,
        _id: {$ne: req.user._id}
    }).select('-password')

    res.status(200).json({
        success: true,
        users
    })
})

const refresh = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies

    if(!cookie){
        return res.status(403).json({message: 'Unauthorized'})
    }

    const refreshToken = cookie.chatAppJWT

    jwt.verify(refreshToken, process.env.JWT_SECRET, asyncHandler(async (err, decoded) => {
        if(err) return res.status(403).json({message: 'Forbidden'})

        const foundUser = await User.findById(decoded.id)

        if(!foundUser) return res.status(403).json({message: 'Not Authorized'})

        const token = foundUser.generateAccessToken(foundUser._id)

        res.status(200).json({token})
    }))

})


module.exports = {allUser,registerUser, loginUser, uploadImage, refresh}