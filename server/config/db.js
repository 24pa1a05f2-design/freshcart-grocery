const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/grocery_delivery';

  try {
    // Attempt connecting to the specified URI with a short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected successfully to: ${mongoose.connection.host}`);
    return false; // did not need in-memory fallback
  } catch (err) {
    console.warn(`⚠️ Could not connect to local/specified MongoDB at ${uri}.`);
    console.log('🔄 Initializing embedded in-memory MongoDB server for seamless zero-setup execution...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      
      await mongoose.connect(memoryUri);
      console.log(`✅ Embedded In-Memory MongoDB Connected at: ${memoryUri}`);
      return true; // used in-memory server, needs initial seed if empty
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

module.exports = { connectDB };
