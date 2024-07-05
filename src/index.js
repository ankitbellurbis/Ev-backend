// require('dotenv').config({path:'./env'})
const dotenv = require('dotenv');
const connectDB = require('./db/index.js');
const { app } = require('./app.js');

dotenv.config({
    path: "./.env"
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log('Server is running at port  : ', process.env.PORT || 8000)
        })
    })
    .catch((error) => {
        console.log('Mongoose DB connection failed !! error - ', error);
    })