import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import admins from './data/adminData.js';

dotenv.config();
connectDB();

// Isolated function just for Admin data
const importAdminData = async () => {
  try {
    await Admin.deleteMany();

    for (const admin of admins) {
      await Admin.create(admin);
    }

    console.log('🟢 Admin Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error importing admin data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();
    // We will add Client and Appointment deletions here later
    console.log('🔴 All Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`🔴 Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// The Switchboard: Reads the flag you pass in the terminal
if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-admin') {
  importAdminData();
} else {
  console.log('🟡 Please specify a flag (e.g., -admin or -d)');
  process.exit();
}