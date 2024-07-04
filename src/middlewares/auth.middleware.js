const jwt = require('jsonwebtoken');
const { asyncHandler }= require('../utils/asyncHandler.js')
const User = require('../models/User.model.js')
const { ApiResponse } =  require('../utils/ApiResponse.js')

const verifyJwt = async (req, res, next)=>{
    try {
        console.log(req?.cookies)
        const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ",'')
        if(!token) return res.status(401).json(new ApiResponse(401, null, 'Unauthorized request'));
    
        const decodedTokenInfo = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        let user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken");
        if(!user) return res.status(401).json(new ApiResponse(401, null, 'Invalid Access Token'));
    
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new ApiResponse(401, null, error?.message || 'Invalid Access Token'));
        
    }
}

module.exports = {verifyJwt};