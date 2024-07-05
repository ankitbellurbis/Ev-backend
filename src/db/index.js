const mongoose = require('mongoose');
const {DB_NAME} =  require('../constant.js')

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n mongo db connected !! DB HOST : ${connectionInstance.connection.host}`);
        return true;
    } catch (error) {
        console.log("mongo db connection error : ",error);
        process.exit(1);
    }
}

module.exports = connectDB;