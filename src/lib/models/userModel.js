
import mongoose,{Schema} from "mongoose";



export const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // Do not return password in queries
    minlength: [6, "Password must be at least 6 characters long"]
  },
  contactNumber: {
    type: String,
    match: [/^\d{10}$/, "Please enter a valid 10-digit contact number"]
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["Employer", "Job Seeker"],
    default: "Job Seeker"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);


