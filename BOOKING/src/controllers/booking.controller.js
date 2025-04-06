import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { validateBooking } from "../utils/validation.js";
import { ApiError } from "../utils/ApiError.js";
import { Booking } from "../models/booking.model.js";
import mongoose from "mongoose";

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
  const totalBilling =
    validatedData.noOfSeats * flightData.price[validatedData.seatClass];

  try {
    await axios.patch(
      `http://localhost:3000/api/v1/flight/${validatedData.flightId}/seats`,
      {
        seatType: validatedData.seatClass,
        value: validatedData.noOfSeats,
        dec: true,
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
    totalCost: totalBilling,
  });

  // Respond with booking details
  res.json(booking);
});

export const getBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: booking,
  });
});

export const makePayment = asyncHandler(async (req, res) => {
  const { bookingId, totalCost, userId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find the booking details
    const bookingDetails = await Booking.findById(bookingId).session(session);

    if (!bookingDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
    }

    // Step 2: Check if booking is cancelled
    if (bookingDetails.status === "Cancelled") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "The booking has expired");
    }

    // Step 3: Check booking expiry time
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    if (currentTime - bookingTime > 5 * 60 * 1000) {
      await Booking.updateOne(
        { _id: bookingId },
        { status: "Cancelled" },
        { session }
      );
      throw new ApiError(StatusCodes.BAD_REQUEST, "The booking has expired");
    }

    // Step 4: Validate payment amount
    if (bookingDetails.totalCost !== totalCost) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Payment amount mismatch");
    }

    // Step 5: Validate user
    if (bookingDetails.userId.toString() !== userId.toString()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User ID mismatch");
    }

    // Step 6: Update the booking status to 'Confirmed'
    await Booking.updateOne(
      { _id: bookingId },
      { status: "Confirmed" },
      { session }
    );

    // Step 7: Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Step 8: Send success response
    res.status(StatusCodes.OK).json({
      message: "Payment successful, booking confirmed!",
      bookingId,
      status: "Confirmed",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // Send error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Payment failed, something went wrong.",
      error: error.message,
    });
  }
});


export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;  // Assuming bookingId is passed in URL
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch booking details
    const bookingDetails = await Booking.findById(bookingId).session(session);
    if (!bookingDetails) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
    }

    // If already cancelled, return success
    if (bookingDetails.status === "Cancelled") {
      await session.commitTransaction();
      session.endSession();
      return res.status(StatusCodes.OK).json({ message: "Booking already cancelled." });
    }

    // Restore seats by calling Flight service (make sure FLIGHT_SERVICE is defined)
    await axios.patch(
      `http://localhost:3000/api/v1/flight/${bookingDetails.flightId}/seats`,
      {
        seatType: bookingDetails.seatClass,
        value: bookingDetails.noOfSeats,
        dec: false, // false means increasing available seats
      }
    );

    // Update booking status to "Cancelled"
    await Booking.updateOne(
      { _id: bookingId },
      { status: "Cancelled" },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(StatusCodes.OK).json({ message: "Booking successfully cancelled." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
  console.error("Error in cancelBooking:", error);  // Log the error for debugging
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Error canceling booking.",
    error: error.message,  // Optionally include the error message
  });
}
}


export const cancelOldBookings = async () => {
  try {
    // Calculate the time 5 minutes ago
    const timeThreshold = new Date(Date.now() - 1000 * 300); // 300 seconds = 5 minutes ago

    // Find all bookings older than the threshold that aren't "Booked" status
    const oldBookings = await Booking.find({
      createdAt: { $lt: timeThreshold },
      status: { $ne: "Confirmed" }, // Only target bookings that are NOT 'Booked'
    });

    if (!oldBookings.length) {
      console.log("No old bookings to cancel.");
      return { message: "No old bookings to cancel." };
    }

    // Cancel the old bookings by updating their status to 'Cancelled'
    const cancelResult = await Booking.updateMany(
      {
        _id: { $in: oldBookings.map((booking) => booking._id) }, // Filter by booking IDs
        status: { $ne: "Confirmed" }, // Only cancel those that are NOT 'Booked'
      },
      {
        $set: { status: "Cancelled" }, // Set status to 'Cancelled'
      }
    );

    console.log(`Cancelled ${cancelResult.modifiedCount} old bookings`);

    return {
      message: `${cancelResult.modifiedCount} old bookings cancelled successfully`,
    };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error canceling old bookings"
    );
  }
};

