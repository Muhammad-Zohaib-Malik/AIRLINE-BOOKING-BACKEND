import { asyncHandler } from '../utils/asyncHandler.js'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Airplane } from '../models/airplane.model.js'
import { ApiError } from '../utils/ApiError.js'
import { validateAirplane } from '../utils/validation.js'
import mongoose from 'mongoose'

export const createAirplane = asyncHandler(async (req, res) => {
  const validatedData = validateAirplane(req.body);
  const airplane = await Airplane.create(validatedData);
  return res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, airplane, "Airplane created successfully"))
})

export const getAllAirplanes = asyncHandler(async (_, res) => {
  const airplanes = await Airplane.find()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, airplanes, "Airplanes retrieved successfully"))
})

export const getAirplaneById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airplane ID format");
  }
  const airplane = await Airplane.findById(id);
  if (!airplane) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Airplane not found");
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, airplane, "Airplane retrieved successfully"))
})

export const deleteAirplaneById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airplane ID format");
  }
  const airplane = await Airplane.findByIdAndDelete(id);
  if (!airplane) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Airplane not found");
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, airplane, "Airplane deleted successfully"))
})

export const updateAirplaneById = asyncHandler(async (req, res) => {
  const validatedData = validateAirplane(req.body);
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid airplane ID format");
  }
  const airplane = await Airplane.findByIdAndUpdate(id, validatedData, { new: true });
  if (!airplane) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Airplane not found");
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, airplane, "Airplane updated successfully"))
})