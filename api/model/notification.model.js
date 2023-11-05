import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // User ID associated with the notification
      required: true,
    },
    message: {
      type: String, // Notification message
      required: true,
    },
    orderId: {
      type: String, // Notification message
      required: false,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Notifications ||
  mongoose.model("Notification", notificationSchema);
