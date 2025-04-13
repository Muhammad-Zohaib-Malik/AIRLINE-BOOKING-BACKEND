import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    recipientEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket", TicketSchema);
