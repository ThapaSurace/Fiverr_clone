import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    isSeller: {
      type: Boolean,
      default:false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String, // Store the OTP here
      required: false, // Make it required during registration, not after verification
    },
    verified: {
      type: Boolean,
      default: false, // Mark as true after successful email verification
    },
},{
    timestamps: true
});

export default mongoose.model.Users || mongoose.model("User",userSchema)