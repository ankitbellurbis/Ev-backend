const express = require('express');
const { getAllStationDetails, getStationDetail } = require('../controllers/station.controller');
const { verifyJwt } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getAllStationDetails);
router.get('/:id',  getStationDetail);

module.exports = router