const BMError = require('./error');

const cloudinary = require('cloudinary').v2


const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const imageUploader = async (res,image,folderName) => {
    try {
        if(Array.isArray(image)){
            throw new BMError(400,'Only one image is valid')
        }

        if (!allowedMimeTypes.includes(image.mimetype)) {;
            throw new BMError(400,"Invalid file type. Only JPEG, JPG, and PNG files are allowed");
        }

        const uploadOptions = { folder: folderName };

        const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath,uploadOptions)

        return uploadedImage
    } catch (error) {
        throw new BMError(400, error.message)
    }
}

module.exports = { imageUploader }