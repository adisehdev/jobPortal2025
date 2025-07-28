import mongoose,{Schema} from "mongoose";



export const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      minlength: [3, "Job title must be at least 3 characters long"],
      maxlength: [100, "Job title must not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      minlength: [10, "Job description must be at least 10 characters long"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      maxlength: [50, "Company name must not exceed 50 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    salaryRange: {
      type: String,
      required: [true, "Salary range is required"],
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior-level"],
      default: "Entry-level",
    },
    jobCategory: {
      type: String,
      required: [true, "Job category is required"],
      enum: [
        "IT",
        "Finance",
        "Healthcare",
        "Education",
        "Marketing",
        "Engineering",
        "Sales",
        "Other",
      ],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);










