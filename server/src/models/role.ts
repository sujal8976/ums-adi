import mongoose, { Document, Schema } from "mongoose";

// Define interfaces
interface Permission {
  page: string;
  actions: string[];
}

export interface RoleDocument extends Document {
  name: string;
  precedence: number;
  permissions: Permission[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define schemas
const PermissionSchema = new Schema<Permission>({
  page: { type: String, required: true },
  actions: [{ type: String, required: true }],
});

const RoleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    precedence: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    permissions: [PermissionSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Export the model
export default mongoose.model<RoleDocument>("Role", RoleSchema);
