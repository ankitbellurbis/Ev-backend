const mongoose = require('mongoose');
const Charger = require('./Charger.model');

const stationSchema = new mongoose.Schema({
    stationName: {
        type: String,
        required: true
    },
    stationPicture: {
        type: String,
        required: true
    },
    operatorName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    },
    landMark: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    latLong: {
        type: String,
        required: true
    },
    chargerDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Charger"
        }
    ]
}, { timestamps: true });

const Station = mongoose.model("Station", stationSchema);

module.exports = Station