const { asyncHandler } = require('../utils/asyncHandler.js');
const Station = require('../models/Station.model.js');
const { ApiResponse } = require('../utils/ApiResponse.js');

const getAllStationDetails = asyncHandler(async (req, res) => {
    try {
        const stationDetails = await Station.aggregate([
            {
                $lookup: {
                    from: 'chargers',
                    localField: 'chargerDetails',
                    foreignField: '_id',
                    as: 'chargerDetails'
                }
            },
            {
                $lookup: {
                    from: 'states',
                    localField: 'state',
                    foreignField: '_id',
                    as: 'state'
                }
            },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'city'
                },
            },
            {
                $unwind: "$city",
            },
            {
                $unwind: "$state",
            },
            {
                $addFields: {
                    city: '$city.name',  // Include specific fields from the first result
                    state: '$state.name',  // Include specific fields from the second result
                }
            },
        ]);
        if (!stationDetails || stationDetails.length === 0) return res.status(404).json(new ApiResponse(404, 'no station List found'));
        return res.status(200).json(new ApiResponse(200, stationDetails, 'Station list'));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
})

const getStationDetail = asyncHandler(async (req, res) => {
    try {

        const stationDetails = await Station.findById(req.params.id).populate([
            {
                path: 'chargerDetails'
            },
            {
                path: 'state',
                select:'name'
            },
            {
                path: 'city',
                select:'name'
            },
            
        ]
        );
        if (!stationDetails) return res.status(404).json(new ApiResponse(404, null, 'no station found'));
        return res.status(200).json(new ApiResponse(200, stationDetails, 'charger detail'));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
})

module.exports = { getAllStationDetails, getStationDetail }