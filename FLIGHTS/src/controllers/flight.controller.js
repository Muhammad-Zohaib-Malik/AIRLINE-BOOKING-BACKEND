import { StatusCodes } from "http-status-codes";
import { Flight } from "../models/flight.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateFlight } from "../utils/validation.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { Airplane } from "../models/airplane.model.js";
import { Airport } from "../models/airport.model.js";

export const createFlight = asyncHandler(async (req, res) => {
  try {
    const validatedData = validateFlight(req.body);

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(validatedData.airplaneId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Airplane ID");
    }
    if (!mongoose.Types.ObjectId.isValid(validatedData.departureAirportId)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid Departure Airport ID"
      );
    }
    if (!mongoose.Types.ObjectId.isValid(validatedData.arrivalAirportId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Arrival Airport ID");
    }

    // Check if the airplane exists
    const airplaneExists = await Airplane.findById(validatedData.airplaneId);
    if (!airplaneExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Airplane not found");
    }

    // Check if the departure airport exists
    const departureAirportExists = await Airport.findById(
      validatedData.departureAirportId
    );
    if (!departureAirportExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Departure airport not found");
    }
    // Check if the arrival airport exists
    const arrivalAirportExists = await Airport.findById(
      validatedData.arrivalAirportId
    );
    if (!arrivalAirportExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Arrival airport not found");
    }

    // Check that departure and arrival airports are not the same
    if (validatedData.departureAirportId === validatedData.arrivalAirportId) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Departure and arrival airports cannot be the same"
        )
      );
    }

    const flight = await Flight.create(validatedData);
    return res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          flight,
          "Flight created successfully"
        )
      );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Flight with this name already exists"
      );
    }
  }
});

export const getAllFlightsWithFilters = asyncHandler(async (req, res) => {
  const { trips, price, classType, travellers, tripType } = req.query;
  let matchStage = {};

  // handle trip departure to arrival
  if (trips) {
    const [departureCode, arrivalCode] = trips.split("-");
    const airports = await Airport.find({
      code: { $in: [departureCode, arrivalCode] },
    }).lean();

    const departureAirport = airports.find(
      (airport) => airport.code === departureCode
    );
    const arrivalAirport = airports.find(
      (airport) => airport.code === arrivalCode
    );

    if (!departureAirport || !arrivalAirport) {
      return res.status(404).json({ error: "One or both airports not found" });
    }

    matchStage.departureAirportId = departureAirport._id;
    matchStage.arrivalAirportId = arrivalAirport._id;
  }

  //  Handle price filtering
  if (price && price.trim() !== "") {
    const [minPrice, maxPrice] = price.split("-").map(Number);
    matchStage.$or = [
      {
        "price.economy": {
          $gte: minPrice,
          $lte: isNaN(maxPrice) ? Number.MAX_SAFE_INTEGER : maxPrice,
        },
      },
      {
        "price.business": {
          $gte: minPrice,
          $lte: isNaN(maxPrice) ? Number.MAX_SAFE_INTEGER : maxPrice,
        },
      },
    ];
  }

  // handle traveller and classType
  if (travellers) {
    const travellerParts = travellers.split("-").map(Number);
    const [adult = 0, child = 0, infant = 0] =
      travellerParts.length === 3 ? travellerParts : [...travellerParts, 0];

    const totalTraveller = adult + child + infant;

    if (totalTraveller < 1) {
      throw new ApiError(400, "At least one traveller is required");
    }

    if (classType === "e") {
      matchStage["totalSeats.economy"] = { $gte: totalTraveller };
    } else if (classType === "b") {
      matchStage["totalSeats.business"] = { $gte: totalTraveller };
    } else {
      matchStage.$or = [
        { "totalSeats.economy": { $gte: totalTraveller } },
        { "totalSeats.business": { $gte: totalTraveller } },
      ];
    }
  }

  // handle tripType
  if (["ONE_WAY", "ROUND_TRIP"].includes(tripType)) {
    matchStage.tripType = tripType;
  }

  const flights = await Flight.find(matchStage);

  if (flights.length === 0) {
    throw new ApiError(404, "No flight found for the given filters");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, flights, "Flights fetched successfully"));
});

export const getFlightById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airport ID format");
  }

  const flight = await Flight.findById(id).populate([
    {
      path: "airplaneId",
      select: "airLine modelNumber seatingCapacity status",
    },
    { path: "departureAirportId", select: "name" },
    { path: "arrivalAirportId", select: "name" },
  ]);
  if (!flight) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Flight not found");
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, flight, "Flight fetched successfully")
    );
});

export const deleteFlightById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid flight ID format");
  }
  const flight = await Flight.findOneAndDelete(id);
  if (!flight) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Flight not found");
  }
  await Airplane.findByIdAndDelete(flight.airplaneId);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, flight, "Flight deleted successfully")
    );
});

export const updateFlightBySeats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { seatType, value, dec } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid flight ID format");
  }

  const flight = await Flight.findById(id);
  if (!flight) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Flight not found");
  }

  // Validate the seatType exists in the totalSeats
  if (!flight.totalSeats.hasOwnProperty(seatType)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Invalid seat type: ${seatType}`
    );
  }

  if (typeof value !== "number" || isNaN(value) || value <= 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Invalid value: value should be a positive number"
    );
  }

 
  if (dec !== undefined && typeof dec !== "boolean") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Invalid dec flag: dec should be a boolean"
    );
  }

  const session = await mongoose.startSession(); 

  try {
    session.startTransaction(); 


    const updatedFlight = await updateRemainingSeats(id, seatType, value, dec, session);

    await session.commitTransaction(); 

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          updatedFlight,
          "Flight updated successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction(); 
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  } finally {
    session.endSession(); 
  }
});

const updateRemainingSeats = async (flightId, seatType, value, dec = true, session) => {
  const flight = await Flight.findById(flightId).session(session);

  if (!flight) {
    throw new Error('Flight not found');
  }

  if (dec) {
    if (flight.totalSeats[seatType] < value) {
      throw new Error('Not enough seats available');
    }
    flight.totalSeats[seatType] -= value;
  } else {
    flight.totalSeats[seatType] += value;
  }

  await flight.save({ session }); 

  return flight;
};
