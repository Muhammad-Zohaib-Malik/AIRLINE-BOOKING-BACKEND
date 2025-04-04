import { z } from "zod";
import mongoose from "mongoose";


export const bookingSchema = z.object({
  flightId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid Flight ID format",
  }),
  // userId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
  //   message: "Invalid User ID format",
  // }),
  // status: z.enum(["Confirmed", "Pending", "Initiated", "Cancelled"]).default("Initiated"),
  noOfSeats: z.number().int().positive().min(1).max(10), 
  seatClass: z.enum(["economy", "business"]),
  // totalCost: z.number().positive(),
});



export const validateData = (schema, data) => {
  const parsedBody = schema.safeParse(data);
  if (!parsedBody.success) {
    const errorMessage = parsedBody.error.errors
      .map((err) => err.message)
      .join(", ");
    throw new Error(errorMessage);
  }
  return parsedBody.data;
};


export const validateBooking = (data) => validateData(bookingSchema, data);
