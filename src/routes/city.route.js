const express = require('express');
const { getCityMasterList, getCityListById } = require('../controllers/city.controller');

const router = express.Router();

router.get('/', getCityMasterList);
router.get('/:id', getCityListById);

module.exports = router;