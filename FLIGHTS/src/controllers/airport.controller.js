import { Airport } from "../models/airport.model.js";
import { City } from "../models/city.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateAirport } from "../utils/validation.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const createAirport = asyncHandler(async (req, res, next) => {
  const validatedData = validateAirport(req.body);
  const existCity = await City.findById(validatedData.city);
  if (!existCity) {
    throw new ApiError(StatusCodes.NOT_FOUND, "City not found");
  }
  try {
    const airport = await Airport.create(validatedData);
    return res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          airport,
          "Airport created successfully"
        )
      );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Airport with this name already exists"
      );
    }
    next(error);
  }
});

export const getAllAirports = asyncHandler(async (_, res) => {
  const airports = await Airport.find().populate("city");
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        airports,
        "All airports fetched successfully"
      )
    );
});

export const getAirportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airport ID format");
  }
  const airport = await Airport.findById(id);
  if (!airport) {
    throw new ApiError(StatusCodes.NOT_FOUND, "airport not found");
  }
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, airport, "airport retrieved successfully")
    );
});

export const deleteAirportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airport ID format");
  }
  const airport = await Airport.findOneAndDelete(id);
  if (!airport) {
    throw new ApiError(StatusCodes.NOT_FOUND, "airport not found");
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, airport, "airport deleted successfully")
    );
});

export const updateAirportById = asyncHandler(async (req, res) => {
  const validatedData = validateAirport(req.body);
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airport ID format");
  }
  const airport = await Airport.findByIdAndUpdate(id, validatedData, {
    new: true,
  });
  if (!airport) {
    throw new ApiError(StatusCodes.NOT_FOUND, "airport not found");
  }
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, airport, "airport updated successfully")
    );
});
