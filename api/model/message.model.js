import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
  docUrl: {
    type: String,
    required: false
  },
  docName:{
    type: String,
    required: false
  }
},{
  timestamps:true
});

export default mongoose.model.Messages || mongoose.model("Message", MessageSchema)