import mongoose from 'mongoose';
const { Schema } = mongoose;

const interactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gigId: {
    type: Schema.Types.ObjectId,
    ref: 'Gig',
    required: true,
  },
  clicked: {
    type: Boolean,
    default: false,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model.Interactions || mongoose.model("Interaction", interactionSchema)