import { z } from "zod";


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

