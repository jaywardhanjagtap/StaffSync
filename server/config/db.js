const mongoose = require('mongoose');

module.exports = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staffsync';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('\n[Tip] Make sure MongoDB is running locally (e.g. net start MongoDB),');
    console.error('or set a cloud MongoDB Atlas URI in server/.env (MONGO_URI=mongodb+srv://...)');
    process.exit(1);
  }
};
