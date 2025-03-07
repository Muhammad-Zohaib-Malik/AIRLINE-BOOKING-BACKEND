import { z } from "zod"

// airplane validation
export const airplaneSchema = z.object({
  airLine: z.string().trim().min(1, "Airline is required and must be a string"),
  modelNumber: z.string().trim().min(1, "Model number is required and must be a string"),
  seatingCapacity: z.number().positive("Seating capacity must be a positive number"),
  status: z.string().optional(),
})

// city validation

export const citySchema = z.object({
  name: z.string().trim().min(1, "City name is required and must be a string"),
})

// airport validation

export const airportSchema = z.object({
  name: z.string().trim().min(1, "Name is required and must be a string"),
  code: z.string().trim().min(1, "Code is required and must be a string"),
  city: z.string().length(24, "City ID must be a valid ObjectId"),
  address: z.string().trim().min(5, "Address is required")
})




export const validateData = (schema, data) => {
  const parsedBody = schema.safeParse(data);
  if (!parsedBody.success) {
    const errorMessage = parsedBody.error.errors.map(err => err.message).join(", ");
    throw new Error(errorMessage);
  }
  return parsedBody.data;
};

export const validateAirplane = (data) => validateData(airplaneSchema, data);
export const validateCity = (data) => validateData(citySchema, data);
export const validateAirport = (data) => validateData(airportSchema, data);
