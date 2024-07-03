const mongoose = require('mongoose');

const chargerSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true
    },
    connectorType: {
        type: String,
        required: true
    },
    chargingCapacity: {
        type: String,
        required: true
    },
    currentAmpValue: {
        type: String,
        required: true
    },
    isAvailable: {
        type: String,
        required: true
    },
    isFastCharging: {
        type: String,
        required: true
    },
    numberOfSlots: {
        type: String,
        required: true
    },
    availableTiming: {
        type: String,
        required: true
    },
    chargerImage: {
        type: String,
        required: true
    },

}, { timestamps: true })

const Charger = mongoose.model("Charger", chargerSchema);

module.exports = Charger