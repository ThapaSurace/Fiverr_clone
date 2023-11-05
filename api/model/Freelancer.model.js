import mongoose from "mongoose";
const { Schema } = mongoose;

const freelancerSchema = new Schema(
  {
    userId: {
    type: Schema.Types.ObjectId, 
     ref: 'User'
    },
    display_name: {
      type:String,
      required: true
    },
    desc: {
      type: String,
      required: true,
    },
    skills: [{
      type: String,
      required: true,
    }],
    languages: {
      type: [String],
      required: true
    },
    personal_website: {
      type: String,
      required: false
    },
    certificates: [
      {
        certificate: {
          type: String,
          required: false
        },
        from: {
          type: String,
          required: false
        },
        year: {
          type: String,
          required: false
        }
      }
    ],
    educations: [
      {
        country: {
          type: String,
          required: false
        },
        major: {
          type: String,
          required: false
        },
        collegeName: {
          type: String,
          required: false
        },
        selectedEducationYear: {
          type: String,
          required: false
        }
      }
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Freelancers || mongoose.model("Freelancer", freelancerSchema);
