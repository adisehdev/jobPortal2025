import mongoose, { Mongoose } from "mongoose";


const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Job id is required"],
  },

  firstName: {
    type: String,
    required: [true, "First name is required"],
  },

  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
  },

  contactNumber: {
    type: String,
  },

  address: {
    type: String,
    required: [true, "Address is required"],
  },

  resume: {
    type: String,
    required: [true, "Resume is required"],
  },

  coverLetter: {
    type: String,
  },

  workExperience: {
    type: String,
    enum: [
      "Fresher (0-2 years)",
      "Mid-Career (2-5 years)",
      "Senior (5+ years)",
    ],
    required: [true, "Work experience is required"],
  },

  applicantData: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required for applicant data"],
    },

    role: {
      type: String,
      required: [true, "Role is required for applicant data"],
    },
  },

  employerData: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required for employer data"],
    },

    role: {
      type: String,
      required: [true, "Role is required for employer data"],
    },
  },

  applicationStatus : {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    required: [true, "Application status is required"],
  },

  postedOn: {
    type: Date,
    default: Date.now,
  },

  reviewedOn : {
    type : Date
  },

  keyWordMatchScore : {
    type : Number //stores the tf-idf score
  },

  aiMatchScore : {
    type : Number //stores the AI match score
  },

  aiJustification : {
    type : String //stores the AI justification for the match score
  },

  aiAnalysisStatus : {
    type : String,
    enum : ["not_started","in_progress","completed","failed"],
    default : "not_started"
  },

  jobExists : {
    type : Boolean,
    default : true
  }
});

const Application = mongoose.models?.Application || mongoose.model("Application", applicationSchema);
export default Application



