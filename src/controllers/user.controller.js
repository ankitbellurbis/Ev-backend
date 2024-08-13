const { asyncHandler } = require('../utils/asyncHandler.js')
const User = require('../models/User.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const jwt = require('jsonwebtoken');
const sendEmail = require('../middlewares/mail.middleware.js');

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {

        let user = await User.findById(userId);
        let accessToken = await user.generateAccessToken();
        let refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, 'something went wrong during generating access token & refresh token')
        );
    }
}

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email, fullName, password } = req.body;
        if ([fullName, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json(new ApiResponse(400, null, 'All fields are required'));
        }

        const existedUser = await User.findOne({
            email
        })
        if (existedUser) return res.status(409).json(new ApiResponse(409, null, 'User already exist'))

        const userDataLocal = await User.create({
            fullName, password, email, userName: `user${Date.now()}`, dateOfBirth: null
        });
        let userData = await User.findById(userDataLocal._id).select(
            "-password -refreshToken"
        )
        if (!userData) return res.status(500).json(new ApiResponse(500, null, 'something went wrong during registration'))
        await sendEmail(email, 'Welcome to Charger Ev', 'Congratulations, you are successfully login to Charger Ev Application. hope you enjoy this application', 'Welcome to Charger Ev')

        return res.status(201).json(
            new ApiResponse(201, userData, 'User register successfully')
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) return res.status(400).json(new ApiResponse(400, null, 'user Name is required'))
        if (!password) return res.status(400).json(new ApiResponse(400, null, 'password is required'))

        const userData = await User.findOne({ email })
        if (!userData) return res.status(404).json(new ApiResponse(404, null, 'user does not exist'))

        const isPasswordCorrect = await userData.validPassword(password);
        if (!isPasswordCorrect) return res.status(400).json(new ApiResponse(400, null, 'Incorrect password'))
        let { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(userData._id);
        const loggedInUser = await User.findById(userData?._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200, {
                user: loggedInUser,
                accessToken, refreshToken
            }, 'user logged in successfully'))
    } catch (error) {
        return res
            .status(500).json(new ApiResponse(500, null, error.message))
    }
})

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                refreshToken: undefined
            }
        });

        return res
            .status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json(new ApiResponse(200, {}, 'user logged out'));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) return res.status(401).json(new ApiResponse(401, null, 'unauthorized request'));

    try {
        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user) return res.status(401).json(new ApiResponse(401, null, 'invalid refresh token'));
        if (user?.refreshToken != incomingRefreshToken) return res.status(401).json(new ApiResponse(401, null, 'invalid refresh token'));

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user?._id);

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200,
                { accessToken, refreshToken },
                'Token updated successfully')
            )
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error?.message || 'invalid refresh token'));
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json(new ApiResponse(400, null, 'password field is required'));

    const user = await User.findById(req?.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) return res.status(400).json(new ApiResponse(400, null, 'Invalid password'));

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'password updated successfully'))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(new ApiResponse(200, req.user, 'user'))
})

const updateAccountDetail = asyncHandler(async (req, res) => {
    try {
        console.log('inside update method', req.files, req.files?.avatar[0]?.path)

        const { fullName, dateOfBirth, state, city } = req.body;
        if (!fullName || !dateOfBirth || !state || !city) return res.status(400).json(new ApiResponse(400, null, 'All fields are required'));

        const avatarLocalPath = req.files?.avatar[0]?.path;

        if (!avatarLocalPath) return res.status(400).json(new ApiResponse(400, null, 'Avatar file not found'))
        const avatarCloudinaryUrl = await uploadOnCloudinary(avatarLocalPath)

        if (!avatarCloudinaryUrl) return res.status(400).json(new ApiResponse(400, null, 'Avatar file is required'))

        const user = await User.findByIdAndUpdate(req?.user._id, {
            $set: {
                fullName, avatar: avatarCloudinaryUrl?.url, dateOfBirth, state, city
            },
        },
            { new: true })

        if (!user) return res.status(400).json(new ApiResponse(400, null, 'user not found'));
        return res.status(200).json(new ApiResponse(200, user, 'user updated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
})

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetail }