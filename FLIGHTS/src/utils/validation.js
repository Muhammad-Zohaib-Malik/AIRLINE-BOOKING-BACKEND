import { z } from "zod"

export const airplaneSchema = z.object({
  airLine: z.string().trim().min(1, "Airline is required and must be a string"),
  modelNumber: z.string().trim().min(1, "Model number is required and must be a string"),
  seatingCapacity: z.number().positive("Seating capacity must be a positive number"),
  status: z.string().optional(),
})

export const validateAirplane = (data) => {
  const parsedBody = airplaneSchema.safeParse(data);
  if (!parsedBody.success) {
    const errorMessage = parsedBody.error.errors.map(err => err.message).join(", ");
    throw new Error(errorMessage);
  }
  return parsedBody.data;
};


export const citySchema = z.object({
  name: z.string().trim().min(1, "City name is required and must be a string"),
})

export const validateCity = (data) => {
  const parsedBody = airplaneSchema.safeParse(data);
  if (!parsedBody.success) {
    const errorMessage = parsedBody.error.errors.map(err => err.message).join(", ");
    throw new Error(errorMessage);
  }
  return parsedBody.data;
};

