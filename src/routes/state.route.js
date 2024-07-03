const express = require('express');
const { getAllStateList } = require('../controllers/state.controller');

const router = express.Router()

router.get('/', getAllStateList);

module.exports = router;