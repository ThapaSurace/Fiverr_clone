import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    gigId: {
      type:String,
      required: true,
    },
    title: {
      type:String,
      required: true,
    },
    price: {
      type:Number,
      required: true,
    },
    cat: {
      type:String,
      required: true,
    },
    cover: {
      type:String,
      required: true,
    },
    shortDesc: {
      type:String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    payment_intent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["delivered", "late", "inProgress"],
      default: "inProgress", // Default to inProgress, as it's ongoing
    },
    deliveredBySeller: {
      type: Boolean,
      default: false,
    },
    acceptedByBuyer: {
      type: Boolean,
      default: false,
    },
    revisionNumber:{
      type:Number,
      required:true
    }
    ,
    revisionReason: {
      revisionTitle: {
        type: String,
        required: false,
      },
      revisionDesc: {
        type: String,
        required: false,
      },
    },
    finishedProduct: {
      document: {
        type: [String], // Change the type to match the actual data type of the document
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
    },
    clientRequirements: {
      document: {
        type: [String], // Change the type to match the actual data type of the document
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.virtual("deliveryDate").get(function () {
  const orderDate = this.createdAt; // Assuming createdAt field is automatically added due to timestamps
  const deliveryTimeInMilliseconds = this.deliveryTime * 24 * 60 * 60 * 1000;
  const deliveryDate = new Date(
    orderDate.getTime() + deliveryTimeInMilliseconds
  );
  return deliveryDate;
});

OrderSchema.virtual("remainingDays").get(function () {
  const currentDate = new Date();
  const deliveryDate = this.deliveryDate;
  const timeDifference = deliveryDate - currentDate;
  const remainingDays = Math.ceil(timeDifference / (24 * 60 * 60 * 1000)); // Convert milliseconds to days
  return Math.max(remainingDays, 0); // Ensure the result is not negative
});

export default mongoose.model.Orders || mongoose.model("Order", OrderSchema);
