const cloudinary = require('cloudinary');
const fs = require('fs');


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET ,
  secure: true
});

const uploadOnCloudinary = async(localFilePath)=> {
    try {
        console.log('localFilePath', localFilePath);
        if(!localFilePath) return null;         
        //upload the file on cloudinary
        const response = await cloudinary.v2.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        fs.unlinkSync(localFilePath);
        //file has been uploaded successfully
        // console.log('file is uploaded on cloudinary', response.url);
        return response;
    } catch (error) {
        fs.unlink(localFilePath) // remove the locally saved temprary file
        console.log("cloudinary error during upload : ",error)
        return null;        
    }
}

module.exports = { uploadOnCloudinary }