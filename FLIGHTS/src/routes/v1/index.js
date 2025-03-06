
import express from 'express'
import { createAirplane, deleteAirplaneById, getAirplaneById, getAllAirplanes, updateAirplaneById } from '../../controllers/airplane.controller.js'


const router = express.Router()

router.post('/airplane', createAirplane)
router.get('/airplane', getAllAirplanes)
router.get('/airplane/:id', getAirplaneById)
router.delete('/airplane/:id', deleteAirplaneById)
router.patch('/airplane/:id', updateAirplaneById)

export default router