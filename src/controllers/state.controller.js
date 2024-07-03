const State = require('../models/State.model.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const {asyncHandler} = require('../utils/asyncHandler.js');

const getAllStateList = asyncHandler(async (req, res) => {
    const stateList = await State.find({})
    return res
        .status(200)
        .json(new ApiResponse(200, stateList, 'state list'))
})

module.exports = { getAllStateList }