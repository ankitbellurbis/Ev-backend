const { asyncHandler } = require('../utils/asyncHandler.js')
const City = require('../models/City.model.js');
const { ApiResponse } = require('../utils/ApiResponse.js');

const getCityMasterList = asyncHandler(async (req, res) => {
    const cityList = await City.find({})
    console.log(cityList)
    return res
        .status(200)
        .json(new ApiResponse(200, cityList, 'city list'))
    })
    
    const getCityListById = asyncHandler(async (req, res) => {
        try {
        console.log(req?.params)
        let _id = req?.params?.id
        const cityList = await City.find({stateId:_id})
        console.log(cityList)
        return res
        .status(200)
        .json(new ApiResponse(200, cityList, 'city list'))
    } catch (error) {
        return res
        .status(500)
        .json(new ApiResponse(500, null, error.message))
    }
})

module.exports = {
    getCityMasterList,
    getCityListById
}