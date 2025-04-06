import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { validateBooking } from "../utils/validation.js";
import { ApiError } from "../../../FLIGHTS/src/utils/ApiError.js";
import { Booking } from "../models/booking.model.js";

export const createBooking = asyncHandler(async (req, res) => {
  const validatedData = validateBooking(req.body);
  
  // Fetch flight data
  let flightData;
  try {
    const flight = await axios.get(
      `http://localhost:3000/api/v1/flight/${validatedData.flightId}`
    );
    flightData = flight.data.data;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to retrieve flight data"
    );
  }

  // Check if there are enough available seats
  if (
    validatedData.noOfSeats > flightData.totalSeats[validatedData.seatClass]
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Requested seats exceed available seats"
    );
  }

  // Calculate total billing
  const totalBilling = validatedData.noOfSeats * flightData.price[validatedData.seatClass];

  try {
    await axios.patch(
  `http://localhost:3000/api/v1/flight/${validatedData.flightId}/seats`,
  {
    seatType: validatedData.seatClass, 
    value: validatedData.noOfSeats,
    dec: true
  }
);

  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update available seats"
    );
  }

  // Create booking
  const booking = await Booking.create({
    ...validatedData,
    totalCost: totalBilling
  });

  // Respond with booking details
  res.json(booking);
});
