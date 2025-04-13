import cron from "node-cron";
import { cancelOldBookings } from "../controllers/booking.controller.js";

export const scheduleCrons = () => {
 
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("Running cron job: Cancelling old bookings...");
      const result = await cancelOldBookings();
      console.log(result.message || "Old bookings cancelled successfully.");
    } catch (error) {
      console.log("Error in canceling old bookings:", error);
    }
  });
};