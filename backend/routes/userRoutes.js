const express = require('express')
const { allUser, registerUser, loginUser, uploadImage } = require('../controller/userController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.route('/').get( protect ,allUser)
router.route('/').post(registerUser)
router.post('/login', loginUser)
router.post('/upload-img' , uploadImage)


module.exports = router