// backend/seeder.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import admins from './data/adminData.js';

// Initialize environment variables and database connection
dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear out any existing data
    await Admin.deleteMany();

    // We use a loop with .create() instead of .insertMany() so that your 
    // bcrypt pre-save middleware actually fires and hashes the password
    for (const admin of admins) {
      await Admin.create(admin);
    }

    console.log('🟢 Admin Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();
    console.log('🔴 Admin Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check the terminal command flag to determine whether to import or destroy
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}