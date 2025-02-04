import mongoose from "mongoose";
import { DB_URI, SUPER_ADMIN_USERNAME } from "./config/dotenv";
import Role from "./models/role";
import User from "./models/user";
import bcrypt from "bcrypt";

const defaultSuperAdminPermissions = [
  {
    page: "Dashboard",
    actions: ["read"],
  },
  {
    page: "Users",
    actions: [
      "read",
      "reset-password",
      "create-user",
      "lock-user",
      "read-details",
      "update-user",
      "delete-user",
    ],
  },
  {
    page: "Task",
    actions: ["read", "create", "delete", "update"],
  },
  {
    page: "Report",
    actions: ["read-users"],
  },
  {
    page: "Settings",
    actions: [
      "create-role",
      "update-role",
      "read-role",
      "delete-role",
      "change-precedence",
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");

    // Create a temporary system user for created/updated by references
    const systemUserId = new mongoose.Types.ObjectId();

    // Create super admin role
    const superAdminRole = await Role.findOneAndUpdate(
      { name: "Super Admin" },
      {
        name: "Super Admin",
        precedence: 1, // Highest precedence
        permissions: defaultSuperAdminPermissions,
        createdBy: systemUserId,
        updatedBy: systemUserId,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    if (!superAdminRole) {
      throw new Error("Failed to create super admin role");
    }

    const password = "super123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdminUser = await User.findOneAndUpdate(
      { username: SUPER_ADMIN_USERNAME },
      {
        username: SUPER_ADMIN_USERNAME,
        password: hashedPassword, // Change password form will appear after first login
        firstName: "Super",
        lastName: "Admin",
        roles: ["Super Admin"],
        isLocked: false,
        permissions: {}, // Individual permissions can be added here if needed
        settings: {
          isPassChange: true,
          isRegistered: false, //This will allow register on login
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    if (!superAdminUser) {
      throw new Error("Failed to create super admin user");
    }

    // Update the role's created/updated by fields with the actual super admin user
    await Role.findByIdAndUpdate(superAdminRole._id, {
      createdBy: superAdminUser._id,
      updatedBy: superAdminUser._id,
    });

    console.log("Super admin role & user created successfully");
    console.log(`Username: ${superAdminUser.username} \nPassword: ${password}`);

    await mongoose.connection.close();
    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
