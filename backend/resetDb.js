const mongoose = require('mongoose');

async function resetDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/TodoApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Drop the entire database
    await mongoose.connection.dropDatabase();
    console.log('Database reset successfully');

    // Close the connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
