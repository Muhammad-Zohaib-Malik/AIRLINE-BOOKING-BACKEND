import express from "express";
import {
  createAirplane,
  deleteAirplaneById,
  getAirplaneById,
  getAllAirplanes,
  updateAirplaneById,
} from "../../controllers/airplane.controller.js";
import {
  createCity,
  deleteCityById,
  getAllCities,
  getCityById,
  updateCityById,
} from "../../controllers/city.controller.js";
import {
  createAirport,
  deleteAirportById,
  getAirportById,
  getAllAirports,
  updateAirportById,
} from "../../controllers/airport.controller.js";
import {
  createFlight,
  deleteFlightById,
  getAllFlights,
  getAllFlightsWithFilters,
  getFlightById,
  updateFlightById,
} from "../../controllers/flight.controller.js";

const router = express.Router();
// airplane
router.post("/airplane", createAirplane);
router.get("/airplane", getAllAirplanes);
router.get("/airplane/:id", getAirplaneById);
router.delete("/airplane/:id", deleteAirplaneById);
router.patch("/airplane/:id", updateAirplaneById);

// city
router.post("/city", createCity);
router.get("/city", getAllCities);
router.get("/city/:id", getCityById);
router.delete("/city/:id", deleteCityById);
router.patch("/city/:id", updateCityById);

// airport
router.post("/airport", createAirport);
router.get("/airport", getAllAirports);
router.get("/airport/:id", getAirportById);
router.delete("/airport/:id", deleteAirportById);
router.patch("/airport/:id", updateAirportById);

//flight
router.post("/flight", createFlight);
// router.get("/flight", getAllFlights);
router.get("/flight", getAllFlightsWithFilters);

router.get("/flight/:id", getFlightById);
router.delete("/flight/:id", deleteFlightById);
router.patch("/flight/:id", updateFlightById);

export default router;
