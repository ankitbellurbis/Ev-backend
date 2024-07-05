const multer = require('multer')
const fs = require('fs');
const path = require('path');

// Ensure the directory exists
const uploadDir = path.join(__dirname, 'public', 'temp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

module.exports = {upload};