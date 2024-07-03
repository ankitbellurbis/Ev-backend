const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        unique:true
    },
    fullName: {
        type: String,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next(); // check if field is modified or not
    this.password = await bcrypt.hash(this.password, 10); // salt ya hashround
    next();
})

userSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

const User = mongoose.model("User", userSchema);

module.exports = User