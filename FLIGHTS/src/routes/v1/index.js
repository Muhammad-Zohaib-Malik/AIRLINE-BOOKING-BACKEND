
import express from 'express'
import { createAirplane, deleteAirplaneById, getAirplaneById, getAllAirplanes, updateAirplaneById } from '../../controllers/airplane.controller.js'
import { createCity, deleteCityById, getAllCities, getCityById, updateCityById } from '../../controllers/city.controller.js'


const router = express.Router()
// airplane 
router.post('/airplane', createAirplane)
router.get('/airplane', getAllAirplanes)
router.get('/airplane/:id', getAirplaneById)
router.delete('/airplane/:id', deleteAirplaneById)
router.patch('/airplane/:id', updateAirplaneById)


// city
router.post('/city', createCity)
router.get('/city', getAllCities)
router.get('/city/:id', getCityById)
router.delete('/city/:id', deleteCityById)
router.patch('/city/:id', updateCityById)









export default router