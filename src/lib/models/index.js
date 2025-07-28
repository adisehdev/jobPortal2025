import { userSchema } from "./userModel";
import { jobSchema } from "./jobModel";
import { applicationSchema } from "./applicationModel";
import mongoose from "mongoose";


export const Job = mongoose.models?.Job || mongoose.model("Job", jobSchema);
export const Application = mongoose.models?.Application || mongoose.model("Application", applicationSchema);
