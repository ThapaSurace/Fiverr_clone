import mongoose from "mongoose";
const { Schema } = mongoose;

const wishlistSchema = new Schema(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Wishlists || mongoose.model("Wishlist", wishlistSchema);
