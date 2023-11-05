import mongoose from "mongoose";
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    gigId: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      reportType: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: false,
      }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Reports || mongoose.model("Report", ReportSchema);
