```javascript
import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (dbConnectError) {
    // Log the error if the connection fails
    console.error("MongoDB connection error:", dbConnectError);
    // Exit the process with an error code
    process.exit(1);
  }
};

export default connectDB;
```