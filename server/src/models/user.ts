import mongoose, { Document, Schema } from "mongoose";

// Interface representing a User document in MongoDB
export interface UserAccount extends Document {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  dob?: Date;
  email?: string;
  phone?: string;
  isLocked: boolean;
  permissions?: object;
  settings?: {
    isRegistered?: boolean;
    isPassChange: boolean;
  };
}

// Define the schema
const userSchema = new Schema<UserAccount>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  roles: { type: [String], required: true }, // Array of strings
  dob: { type: Date },
  email: { type: String },
  phone: { type: String },
  isLocked: { type: Boolean, default: false },
  permissions: { type: Object, default: {} },
  settings: {
    isPassChange: { type: Boolean, default: false },
    isRegistered: { type: Boolean, default: false },
  },
});

// Export the model
export default mongoose.model<UserAccount>("User", userSchema);
