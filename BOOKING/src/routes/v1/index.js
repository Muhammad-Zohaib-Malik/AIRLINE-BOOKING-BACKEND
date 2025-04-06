import express from "express";
import { cancelBooking, createBooking, getBooking, makePayment } from "../../controllers/booking.controller.js";

const router=express.Router()
router.post('/bookings',createBooking)
router.get('/booking/:id',getBooking)
router.post('/payment',makePayment)
router.patch('/cancelBooking/:bookingId', cancelBooking);


export default router;
