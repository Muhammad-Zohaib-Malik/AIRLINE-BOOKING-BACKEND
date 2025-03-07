import { asyncHandler } from "../utils/asyncHandler.js";
import { validateCity } from "../utils/validation.js";
import { City } from '../models/city.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createCity = asyncHandler(async (req, res) => {
  const validatedData = validateCity(req.body);
  const city = await City.create(validatedData);
  return res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, city, "City created successfully"))

})

export const getAllCities = asyncHandler(async (_, res) => {
  const city = await City.find()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, city, "City retrieved successfully"))
})

export const getCityById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid city ID format");
  }
  const city = await City.findById(id);
  if (!city) {
    throw new ApiError(StatusCodes.NOT_FOUND, "city not found");
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, city, "city retrieved successfully"))
})

export const deleteCityById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid city ID format");
  }
  const city = await City.findById(id);
  if (!city) {
    throw new ApiError(StatusCodes.NOT_FOUND, "city not found");
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, city, "city deleted successfully"))
})

export const updateCityById = asyncHandler(async (req, res) => {
  const validatedData = validateCity(req.body);
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid city ID format");
  }
  const city = await Airplane.findByIdAndUpdate(id, validatedData, { new: true });
  if (!city) {
    throw new ApiError(StatusCodes.NOT_FOUND, "city not found");
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, airplane, "city updated successfully"))
})