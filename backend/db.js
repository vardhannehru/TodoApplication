const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect('mongodb://localhost:27017/TodoApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;