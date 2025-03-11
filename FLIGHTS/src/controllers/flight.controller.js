import { StatusCodes } from "http-status-codes";
import { Flight } from "../models/flight.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateFlight } from "../utils/validation.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { Airplane } from "../models/airplane.model.js";

export const createFlight = asyncHandler(async (req, res,next) => {
  try {
    const validatedData = validateFlight(req.body);
    const flight = await Flight.create(validatedData);
    return res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, flight, "Flight created successfully"))

  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, "Flight with this name already exists");
    }
        return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "An error occurred"));

  }
})  


export const getAllFlights = asyncHandler(async (_, res) => {

})
export const getFlightById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airport ID format");
  }

  const flight = await Flight.findById(id).populate([
    { path: 'airplaneId', select: 'airLine modelNumber seatingCapacity status' },
    { path: 'departureAirportId', select: 'name' },
    { path: 'arrivalAirportId', select: 'name' }
  ]);
  if (!flight) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Flight not found");
  }

  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, flight, "Flight fetched successfully"));
})
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

  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, flight, "Flight deleted successfully"));
})
export const updateFlightById = asyncHandler(async (req, res) => {
  const validatedData = validateFlight(req.body);
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid flight ID format");
  }
  const flight = await Flight.findByIdAndUpdate(id, validatedData, { new: true });
  if (!flight) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Flight not found");
  }

  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, flight, "Flight updated successfully"));
})