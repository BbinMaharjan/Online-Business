import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../modules/users/user.model";
import { ROLES, USER_STATUS, ALL_PERMISSIONS } from "../constants/roles";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";
const SUPER_ADMIN_FIRST_NAME = process.env.SUPER_ADMIN_FIRST_NAME || "Super";
const SUPER_ADMIN_LAST_NAME = process.env.SUPER_ADMIN_LAST_NAME || "Admin";

const seedSuperAdmin = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    } as mongoose.ConnectOptions);

    console.log("MongoDB Connected for seeding...");

    const existingSuperAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (existingSuperAdmin) {
      console.log(`Super admin already exists with email: ${SUPER_ADMIN_EMAIL}`);
      console.log(`Role: ${existingSuperAdmin.role}, Status: ${existingSuperAdmin.status}`);
      
      if (existingSuperAdmin.role !== ROLES.SUPER_ADMIN || existingSuperAdmin.status !== USER_STATUS.ACTIVE) {
        existingSuperAdmin.role = ROLES.SUPER_ADMIN;
        existingSuperAdmin.status = USER_STATUS.ACTIVE;
        existingSuperAdmin.emailVerified = true;
        existingSuperAdmin.permissions = ALL_PERMISSIONS;
        await existingSuperAdmin.save();
        console.log("Updated existing user to SUPER_ADMIN with ACTIVE status and all permissions");
      } else if (!existingSuperAdmin.permissions || existingSuperAdmin.permissions.length === 0) {
        existingSuperAdmin.permissions = ALL_PERMISSIONS;
        await existingSuperAdmin.save();
        console.log("Updated existing SUPER_ADMIN with all permissions");
      }
    } else {
      const superAdmin = new User({
        firstName: SUPER_ADMIN_FIRST_NAME,
        lastName: SUPER_ADMIN_LAST_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        role: ROLES.SUPER_ADMIN,
        status: USER_STATUS.ACTIVE,
        emailVerified: true,
        permissions: ALL_PERMISSIONS,
      });

      await superAdmin.save();
      console.log(`Super admin created successfully!`);
      console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
      console.log(`Password: ${SUPER_ADMIN_PASSWORD}`);
      console.log(`Role: ${ROLES.SUPER_ADMIN}`);
      console.log(`Status: ${USER_STATUS.ACTIVE}`);
      console.log(`Permissions: ${ALL_PERMISSIONS.length} permissions assigned`);
    }

    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
    process.exit(0);
  } catch (error: any) {
    console.error("Error seeding super admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedSuperAdmin();