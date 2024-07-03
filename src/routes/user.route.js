const express = require('express');
const { loginUser, logoutUser, refreshAccessToken, registerUser, getCurrentUser, updateAccountDetail } = require('../controllers/user.controller.js');
const { upload } = require('../middlewares/multer.middleware.js');
const { verifyJwt } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser)
router.post('/logout', verifyJwt, logoutUser)
router.post('/refresh-token', refreshAccessToken)
router.get('/', verifyJwt, getCurrentUser)
router.put('/update', verifyJwt, upload?.fields([
    {
        name:"avatar",
        maxCount:1
    }
]), updateAccountDetail)

// router.route("/register",)

module.exports =  router;