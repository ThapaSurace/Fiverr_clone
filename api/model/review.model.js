import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    communicationRating: {
      type: Number,
      required: true,
    },
    serviceDescriptionRating: {
      type: Number,
      required: true,
    },
    recommendationRating: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        replyText: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Reviews || mongoose.model("Review", ReviewSchema);
