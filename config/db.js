const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leaddesk_mini',
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`[MongoDB Warning] Operating without DB or check connection string in .env file.`);
  }
};

module.exports = connectDB;
