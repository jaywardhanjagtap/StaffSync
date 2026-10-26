const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Announcement = require('./models/Announcement');

(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staffsync';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    await Promise.all([User.deleteMany({}), Announcement.deleteMany({})]);
    const hr = await User.create({ name: 'Hannah HR', email: 'hr@staffsync.com', password: 'hr1234', role: 'hr', department: 'Human Resources', position: 'HR Lead' });
    const mgr = await User.create({ name: 'Mike Manager', email: 'manager@staffsync.com', password: 'mgr1234', role: 'manager', department: 'Engineering', position: 'Engineering Manager' });
    await User.create({ name: 'Eva Employee', email: 'employee@staffsync.com', password: 'emp1234', role: 'employee', department: 'Engineering', position: 'Developer', manager: mgr._id });
    await Announcement.create({ title: 'Welcome to StaffSync', message: 'Mark attendance daily and apply leaves from the Leaves page.', postedBy: hr._id });
    console.log('Database successfully seeded!');
    console.log('Demo Credentials:');
    console.log('  HR:       hr@staffsync.com       / hr1234');
    console.log('  Manager:  manager@staffsync.com  / mgr1234');
    console.log('  Employee: employee@staffsync.com / emp1234');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    console.error('[Tip] Ensure MongoDB is running or specify MONGO_URI in .env');
    process.exit(1);
  }
})();
