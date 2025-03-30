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

// flight validation

export const flightSchema = z.object({
  flightNumber: z.string().trim().min(1, "Flight number is required and must be a string"),
  airplaneId: z.string().length(24, "Airplane ID must be a valid ObjectId"),
  departureAirportId: z.string().length(24, "Departure Airport ID must be a valid ObjectId"),
  arrivalAirportId: z.string().length(24, "Arrival Airport ID must be a valid ObjectId"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP"], {
    errorMap: () => ({ message: "Trip type must be either ONE_WAY or ROUND_TRIP" }),
  }),
  price: z.object({
    economy: z.number().positive("Economy price must be a positive number"),
    business: z.number().positive("Business price must be a positive number"),
  }),
  totalSeats: z.object({
    economy: z.number().positive("Total economy seats must be a positive number"),
    business: z.number().positive("Total business seats must be a positive number"),
  }),
  boardingGate: z.string().optional(),
});





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
export const validateFlight = (data) => validateData(flightSchema, data);
