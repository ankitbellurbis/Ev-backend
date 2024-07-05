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
router.put('/update', verifyJwt, (req, res, next)=>{
    upload?.fields([
    {
        name:"avatar",
        maxCount:1
    }
])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error('Multer error:', err);
        return res.status(500).json({ error: 'File upload failed.' });
    } else if (err) {
        // An unknown error occurred when uploading.
        console.error('Unknown error:', err);
        return res.status(500).json({ error: 'An unknown error occurred during the file upload.' });
    }
    // Everything went fine. Proceed to the next middleware.
    next();
})}, updateAccountDetail)

// router.route("/register",)

module.exports =  router;