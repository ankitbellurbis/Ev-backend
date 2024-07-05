const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config({
    path: "./.env"
})

const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN,credentials: true}));
app.use(express.json({limit:'16kb'}))
app.use(express.static("public"));
app.use(express.urlencoded({extended:true, limit: '16kb'}))
app.use(cookieParser());


//route import
const userRouter = require('./routes/user.route.js');
const cityRouter = require('./routes/city.route.js');
const stateRouter = require('./routes/state.route.js');
const stationRouter = require('./routes/station.route.js');

// routes declaration
app.use('/api/v1/users',userRouter)
app.use('/api/v1/city',cityRouter)
app.use('/api/v1/state',stateRouter)
app.use('/api/v1/station',stationRouter)
app.get('/', (req, res) => {
    res.send('Hello Worlds!')
})

module.exports =  { app }